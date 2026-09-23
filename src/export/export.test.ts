import { compileString } from 'sass';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleExportRequest } from '../export-request';
import { buildTextStyleFiles } from './export-text-styles';
import { TFigmaTextStyle } from './types';
import { normalizeFontWeightValue, prepareTextStyles } from './utils/styles-text';

const createTextStyle = ({
  id,
  name,
  fontFamily = 'Inter',
  fontStyle = 'Regular',
  lineHeight = { unit: 'AUTO' },
  letterSpacing = { value: 0, unit: 'PIXELS' },
  textCase = 'ORIGINAL',
  textDecoration = 'NONE',
  paragraphIndent = 0,
  boundVariables,
}: {
  id: string;
  name: string;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: TFigmaTextStyle['lineHeight'];
  letterSpacing?: TFigmaTextStyle['letterSpacing'];
  textCase?: TFigmaTextStyle['textCase'];
  textDecoration?: TFigmaTextStyle['textDecoration'];
  paragraphIndent?: number;
  boundVariables?: TFigmaTextStyle['boundVariables'];
}): TFigmaTextStyle => ({
  id,
  name,
  fontSize: 16,
  fontName: {
    family: fontFamily,
    style: fontStyle,
  },
  lineHeight,
  letterSpacing,
  textCase,
  textDecoration,
  paragraphIndent,
  boundVariables,
});

const getOnlyPreparedStyle = (preparedStyles: Awaited<ReturnType<typeof prepareTextStyles>>) => {
  return Object.values(preparedStyles).flat()[0];
};

type TMockVariable = {
  id: string;
  name: string;
  variableCollectionId: string;
  valuesByMode: Record<string, VariableValue>;
};

type TMockVariableCollection = {
  id: string;
  defaultModeId: string;
};

const stubFigmaVariables = ({
  variables,
  collections,
}: {
  variables: Record<string, TMockVariable>;
  collections: Record<string, TMockVariableCollection>;
}): void => {
  vi.stubGlobal('figma', {
    variables: {
      getVariableByIdAsync: vi.fn(async (id: string) => variables[id] ?? null),
      getVariableCollectionByIdAsync: vi.fn(async (id: string) => collections[id] ?? null),
    },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('text style preparation', () => {
  it('reserves index.scss for the generated import index', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [createTextStyle({ id: 'index-title', name: 'Index/Title' })],
      variableMode: 'none',
    });
    const [groupFileName] = Object.keys(preparedStyles);
    const files = buildTextStyleFiles(preparedStyles);

    expect(groupFileName).toMatch(/^index-[a-z0-9]+\.scss$/);
    expect(files?.[groupFileName]).toContain('%text-style-index-title');
    expect(files?.['index.scss']).toBe(`@import './${groupFileName.replace(/\.scss$/, '')}';\n`);
  });

  it('uses deterministic unique names for normalization collisions', async () => {
    const styles = [
      createTextStyle({ id: 'slash', name: 'Heading/H1' }),
      createTextStyle({ id: 'hyphen', name: 'Heading-H1' }),
    ];
    const firstResult = await prepareTextStyles({ textStyles: styles, variableMode: 'none' });
    const secondResult = await prepareTextStyles({
      textStyles: [...styles].reverse(),
      variableMode: 'none',
    });
    const getMixinNamesByOriginalName = (
      preparedStyles: Awaited<ReturnType<typeof prepareTextStyles>>
    ): Record<string, string> => {
      return Object.fromEntries(
        Object.values(preparedStyles)
          .flat()
          .map(({ originalName, mixinName }) => [originalName, mixinName])
      );
    };
    const firstMixinNames = getMixinNamesByOriginalName(firstResult);
    const secondMixinNames = getMixinNamesByOriginalName(secondResult);

    expect(firstMixinNames).toEqual(secondMixinNames);
    expect(new Set(Object.values(firstMixinNames))).toHaveLength(2);
    expect(firstMixinNames['Heading/H1']).toMatch(/^text-style-heading-h1-[a-z0-9]+$/);
  });

  it('keeps colliding groups in separate deterministic files', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [
        createTextStyle({ id: 'space-group', name: 'Heading One/H1' }),
        createTextStyle({ id: 'hyphen-group', name: 'Heading-One/H2' }),
      ],
      variableMode: 'none',
    });
    const fileNames = Object.keys(preparedStyles);

    expect(fileNames).toHaveLength(2);
    expect(fileNames.every((fileName) => /^heading-one-[a-z0-9]+\.scss$/.test(fileName))).toBe(
      true
    );
  });

  it('preserves duplicate Figma names by using their style IDs', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [
        createTextStyle({ id: 'duplicate-1', name: 'Body/Regular' }),
        createTextStyle({ id: 'duplicate-2', name: 'Body/Regular' }),
      ],
      variableMode: 'none',
    });
    const mixinNames = Object.values(preparedStyles)
      .flat()
      .map(({ mixinName }) => mixinName);

    expect(new Set(mixinNames)).toHaveLength(2);
    expect(
      mixinNames.every((mixinName) => /^text-style-body-regular-[a-z0-9]+$/.test(mixinName))
    ).toBe(true);
  });

  it('creates safe names for special and empty group names', async () => {
    const specialNames = await prepareTextStyles({
      textStyles: [createTextStyle({ id: 'special', name: 'Heading & Lead/Title:' })],
      variableMode: 'none',
    });
    const emptyGroup = await prepareTextStyles({
      textStyles: [createTextStyle({ id: 'empty', name: '/Caption' })],
      variableMode: 'none',
    });

    expect(Object.keys(specialNames)).toEqual(['heading-lead.scss']);
    expect(specialNames['heading-lead.scss'][0].mixinName).toBe('text-style-heading-lead-title');
    expect(Object.keys(emptyGroup)).toEqual(['unnamed.scss']);
  });

  it('escapes font strings and comment terminators into compilable SCSS', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [
        createTextStyle({
          id: 'escaped',
          name: 'Heading */ Dangerous',
          fontFamily: 'Rock\'n"Roll',
        }),
      ],
      variableMode: 'none',
    });
    const [preparedStyle] = Object.values(preparedStyles).flat();
    const files = buildTextStyleFiles(preparedStyles);
    const [groupFileName] = Object.keys(preparedStyles);
    const groupContent = files?.[groupFileName] ?? '';

    expect(groupContent).toContain('/*figma style name: Heading * / Dangerous*/');
    expect(groupContent).toContain('font-family: "Rock\'n\\"Roll";');
    expect(() =>
      compileString(`${groupContent}\n.example { @include ${preparedStyle.mixinName}; }`)
    ).not.toThrow();
  });

  it('exports and normalizes the additional typography properties in a stable order', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [
        createTextStyle({
          id: 'typography',
          name: 'Heading/Display',
          fontStyle: 'Semi Bold Italic',
          lineHeight: { value: 120.00000476837158, unit: 'PERCENT' },
          letterSpacing: { value: -2.5, unit: 'PERCENT' },
          textCase: 'UPPER',
          textDecoration: 'STRIKETHROUGH',
          paragraphIndent: 24,
        }),
      ],
      variableMode: 'none',
    });
    const files = buildTextStyleFiles(preparedStyles);
    const content = files?.['heading.scss'] ?? '';

    expect(content).toContain(
      [
        '\tfont-size: 16px;',
        '\tfont-family: "Inter";',
        '\tfont-weight: 600;',
        '\tline-height: 120%;',
        '\tletter-spacing: -0.025em;',
        '\tfont-style: italic;',
        '\ttext-transform: uppercase;',
        '\ttext-decoration: line-through;',
        '\ttext-indent: 24px;',
      ].join('\n')
    );
  });

  it('maps automatic, pixel, title-case, underline, and oblique values', async () => {
    const preparedStyle = getOnlyPreparedStyle(
      await prepareTextStyles({
        textStyles: [
          createTextStyle({
            id: 'mapping',
            name: 'Body/Mapping',
            fontStyle: 'Regular Oblique',
            lineHeight: { unit: 'AUTO' },
            letterSpacing: { value: 1.5, unit: 'PIXELS' },
            textCase: 'TITLE',
            textDecoration: 'UNDERLINE',
          }),
        ],
        variableMode: 'none',
      })
    );

    expect(preparedStyle['line-height']).toBe('normal');
    expect(preparedStyle['letter-spacing']).toBe('1.5px');
    expect(preparedStyle['font-style']).toBe('oblique');
    expect(preparedStyle['text-transform']).toBe('capitalize');
    expect(preparedStyle['text-decoration']).toBe('underline');
  });

  it('omits text-transform for small caps because CSS requires font-variant-caps', async () => {
    const preparedStyle = getOnlyPreparedStyle(
      await prepareTextStyles({
        textStyles: [
          createTextStyle({
            id: 'small-caps',
            name: 'Body/Small Caps',
            textCase: 'SMALL_CAPS',
          }),
        ],
        variableMode: 'none',
      })
    );

    expect(preparedStyle['text-transform']).toBeNull();
  });

  it('supports none, variable name, and variable value modes', async () => {
    stubFigmaVariables({
      variables: {
        fontSize: {
          id: 'fontSize',
          name: 'Typography/Font Size',
          variableCollectionId: 'typography',
          valuesByMode: { default: 18.123456 },
        },
        family: {
          id: 'family',
          name: 'Typography/Font.Family',
          variableCollectionId: 'typography',
          valuesByMode: { default: 'Avenir "Next"' },
        },
        weight: {
          id: 'weight',
          name: 'Typography/Font Weight',
          variableCollectionId: 'typography',
          valuesByMode: { default: 650 },
        },
        style: {
          id: 'style',
          name: 'Typography/Font Style',
          variableCollectionId: 'typography',
          valuesByMode: { default: 'Oblique' },
        },
        lineHeight: {
          id: 'lineHeight',
          name: 'Typography/Line Height',
          variableCollectionId: 'typography',
          valuesByMode: { default: 28.00000476837158 },
        },
        letterSpacing: {
          id: 'letterSpacing',
          name: 'Typography/Letter Spacing',
          variableCollectionId: 'typography',
          valuesByMode: { default: 3.141592 },
        },
        indent: {
          id: 'indent',
          name: 'Typography/Paragraph Indent',
          variableCollectionId: 'typography',
          valuesByMode: { default: 12.123456 },
        },
      },
      collections: {
        typography: { id: 'typography', defaultModeId: 'default' },
      },
    });
    const textStyles = [
      createTextStyle({
        id: 'body',
        name: 'Body/Default',
        fontStyle: 'Regular Italic',
        lineHeight: { value: 24, unit: 'PIXELS' },
        letterSpacing: { value: 2, unit: 'PERCENT' },
        paragraphIndent: 8,
        boundVariables: {
          fontSize: { id: 'fontSize' },
          fontFamily: { id: 'family' },
          fontWeight: { id: 'weight' },
          fontStyle: { id: 'style' },
          lineHeight: { id: 'lineHeight' },
          letterSpacing: { id: 'letterSpacing' },
          paragraphIndent: { id: 'indent' },
        },
      }),
    ];

    const styleValues = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'none' })
    );
    const variableNames = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'name' })
    );
    const variableValues = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'value' })
    );

    expect(styleValues['font-size']).toBe('16px');
    expect(styleValues['font-family']).toBe('"Inter"');
    expect(styleValues['font-weight']).toBe('400');
    expect(styleValues['font-style']).toBe('italic');
    expect(styleValues['line-height']).toBe('24px');
    expect(styleValues['letter-spacing']).toBe('0.02em');
    expect(styleValues['text-indent']).toBe('8px');
    expect(variableNames['font-size']).toBe('var(--typography-font-size)');
    expect(variableNames['font-family']).toBe('var(--typography-font-family)');
    expect(variableNames['font-weight']).toBe('var(--typography-font-weight)');
    expect(variableNames['font-style']).toBe('var(--typography-font-style)');
    expect(variableNames['line-height']).toBe('var(--typography-line-height)');
    expect(variableNames['letter-spacing']).toBe('var(--typography-letter-spacing)');
    expect(variableNames['text-indent']).toBe('var(--typography-paragraph-indent)');
    expect(variableValues['font-size']).toBe('18.1235px');
    expect(variableValues['font-family']).toBe('"Avenir \\"Next\\""');
    expect(variableValues['font-weight']).toBe('650');
    expect(variableValues['font-style']).toBe('oblique');
    expect(variableValues['line-height']).toBe('28px');
    expect(variableValues['letter-spacing']).toBe('0.0314em');
    expect(variableValues['text-indent']).toBe('12.1235px');
  });

  it('resolves aliases through each collection default mode', async () => {
    stubFigmaVariables({
      variables: {
        family: {
          id: 'family',
          name: 'Typography/Font Family',
          variableCollectionId: 'semantic',
          valuesByMode: {
            default: { type: 'VARIABLE_ALIAS', id: 'family-value' },
            alternate: 'Wrong Mode',
          },
        },
        'family-value': {
          id: 'family-value',
          name: 'Primitives/Font Family',
          variableCollectionId: 'primitives',
          valuesByMode: {
            default: 'Source Sans 3',
            alternate: 'Wrong Alias Mode',
          },
        },
      },
      collections: {
        semantic: { id: 'semantic', defaultModeId: 'default' },
        primitives: { id: 'primitives', defaultModeId: 'default' },
      },
    });
    const preparedStyle = getOnlyPreparedStyle(
      await prepareTextStyles({
        textStyles: [
          createTextStyle({
            id: 'alias',
            name: 'Body/Alias',
            boundVariables: { fontFamily: { id: 'family' } },
          }),
        ],
        variableMode: 'value',
      })
    );

    expect(preparedStyle['font-family']).toBe('"Source Sans 3"');
  });

  it('falls back to style values for cyclic aliases and unsupported values', async () => {
    stubFigmaVariables({
      variables: {
        fontSize: {
          id: 'fontSize',
          name: 'Font Size',
          variableCollectionId: 'typography',
          valuesByMode: { default: 'invalid' },
        },
        'family-a': {
          id: 'family-a',
          name: 'Family A',
          variableCollectionId: 'typography',
          valuesByMode: { default: { type: 'VARIABLE_ALIAS', id: 'family-b' } },
        },
        'family-b': {
          id: 'family-b',
          name: 'Family B',
          variableCollectionId: 'typography',
          valuesByMode: { default: { type: 'VARIABLE_ALIAS', id: 'family-a' } },
        },
        weight: {
          id: 'weight',
          name: 'Weight',
          variableCollectionId: 'typography',
          valuesByMode: { default: true },
        },
        lineHeight: {
          id: 'lineHeight',
          name: 'Line Height',
          variableCollectionId: 'typography',
          valuesByMode: { default: 'invalid' },
        },
      },
      collections: {
        typography: { id: 'typography', defaultModeId: 'default' },
      },
    });
    const preparedStyle = getOnlyPreparedStyle(
      await prepareTextStyles({
        textStyles: [
          createTextStyle({
            id: 'fallback',
            name: 'Body/Fallback',
            fontFamily: 'Inter',
            fontStyle: 'Bold',
            lineHeight: { value: 20, unit: 'PIXELS' },
            boundVariables: {
              fontSize: { id: 'fontSize' },
              fontFamily: { id: 'family-a' },
              fontWeight: { id: 'weight' },
              lineHeight: { id: 'lineHeight' },
            },
          }),
        ],
        variableMode: 'value',
      })
    );

    expect(preparedStyle['font-size']).toBe('16px');
    expect(preparedStyle['font-family']).toBe('"Inter"');
    expect(preparedStyle['font-weight']).toBe('700');
    expect(preparedStyle['line-height']).toBe('20px');
  });
});

describe('font weight normalization', () => {
  it.each([
    ['450', '450'],
    ['550 Italic', '550'],
    ['1000', '1000'],
    ['0', null],
    ['1001', null],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeFontWeightValue(input)).toBe(expected);
  });
});

describe('export request handling', () => {
  it.each([
    [{ 'body.scss': 'content' }, { 'body.scss': 'content' }],
    [null, null],
  ])('returns a correlated success response for %j', async (result, expected) => {
    const response = await handleExportRequest(
      {
        type: 'export',
        requestId: 'request-success',
        variableMode: 'value',
      },
      async () => result
    );

    expect(response).toEqual({
      type: 'export-text-styles',
      requestId: 'request-success',
      textStyles: expected,
    });
  });

  it('returns a correlated error response when export fails', async () => {
    const response = await handleExportRequest(
      {
        type: 'export',
        requestId: 'request-1',
        variableMode: 'none',
      },
      async () => {
        throw new Error('Figma API unavailable');
      }
    );

    expect(response).toEqual({
      type: 'export-text-styles-error',
      requestId: 'request-1',
      error: 'Figma API unavailable',
    });
  });

  it('normalizes non-Error failures', async () => {
    const response = await handleExportRequest(
      {
        type: 'export',
        requestId: 'request-2',
        variableMode: 'none',
      },
      async () => {
        throw 'unknown failure';
      }
    );

    expect(response).toEqual({
      type: 'export-text-styles-error',
      requestId: 'request-2',
      error: 'unknown failure',
    });
  });
});
