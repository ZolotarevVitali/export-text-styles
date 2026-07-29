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
  boundVariables,
}: {
  id: string;
  name: string;
  fontFamily?: string;
  fontStyle?: string;
  boundVariables?: TFigmaTextStyle['boundVariables'];
}): TFigmaTextStyle => ({
  id,
  name,
  fontSize: 16,
  fontName: {
    family: fontFamily,
    style: fontStyle,
  },
  boundVariables,
});

const getOnlyPreparedStyle = (
  preparedStyles: Awaited<ReturnType<typeof prepareTextStyles>>,
) => {
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
    expect(files?.[groupFileName]).toContain('@mixin text-style-index-title-mixin');
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
      preparedStyles: Awaited<ReturnType<typeof prepareTextStyles>>,
    ): Record<string, string> => {
      return Object.fromEntries(
        Object.values(preparedStyles)
          .flat()
          .map(({ originalName, mixinName }) => [originalName, mixinName]),
      );
    };
    const firstMixinNames = getMixinNamesByOriginalName(firstResult);
    const secondMixinNames = getMixinNamesByOriginalName(secondResult);

    expect(firstMixinNames).toEqual(secondMixinNames);
    expect(new Set(Object.values(firstMixinNames))).toHaveLength(2);
    expect(firstMixinNames['Heading/H1']).toMatch(/^text-style-heading-h1-mixin-[a-z0-9]+$/);
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
      true,
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
    expect(mixinNames.every((mixinName) => /^text-style-body-regular-mixin-[a-z0-9]+$/.test(mixinName)))
      .toBe(true);
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
    expect(specialNames['heading-lead.scss'][0].mixinName).toBe(
      'text-style-heading-lead-title-mixin',
    );
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
    expect(groupContent).toContain('font-family: "Rock\'n\\"Roll", Arial, sans-serif;');
    expect(() =>
      compileString(`${groupContent}\n.example { @include ${preparedStyle.mixinName}; }`),
    ).not.toThrow();
  });

  it('supports none, variable name, and variable value modes', async () => {
    stubFigmaVariables({
      variables: {
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
      },
      collections: {
        typography: { id: 'typography', defaultModeId: 'default' },
      },
    });
    const textStyles = [
      createTextStyle({
        id: 'body',
        name: 'Body/Default',
        boundVariables: {
          fontFamily: { id: 'family' },
          fontWeight: { id: 'weight' },
        },
      }),
    ];

    const styleValues = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'none' }),
    );
    const variableNames = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'name' }),
    );
    const variableValues = getOnlyPreparedStyle(
      await prepareTextStyles({ textStyles, variableMode: 'value' }),
    );

    expect(styleValues['font-family']).toBe('"Inter", Arial, sans-serif');
    expect(styleValues['font-weight']).toBe('400');
    expect(variableNames['font-family']).toBe('var(--typography-font-family)');
    expect(variableNames['font-weight']).toBe('var(--typography-font-weight)');
    expect(variableValues['font-family']).toBe('"Avenir \\"Next\\"", Arial, sans-serif');
    expect(variableValues['font-weight']).toBe('650');
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
      }),
    );

    expect(preparedStyle['font-family']).toBe('"Source Sans 3", Arial, sans-serif');
  });

  it('falls back to style values for cyclic aliases and unsupported values', async () => {
    stubFigmaVariables({
      variables: {
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
            boundVariables: {
              fontFamily: { id: 'family-a' },
              fontWeight: { id: 'weight' },
            },
          }),
        ],
        variableMode: 'value',
      }),
    );

    expect(preparedStyle['font-family']).toBe('"Inter", Arial, sans-serif');
    expect(preparedStyle['font-weight']).toBe('700');
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
  it('returns a correlated error response when export fails', async () => {
    const response = await handleExportRequest(
      {
        type: 'export',
        requestId: 'request-1',
        variableMode: 'none',
      },
      async () => {
        throw new Error('Figma API unavailable');
      },
    );

    expect(response).toEqual({
      type: 'export-text-styles-error',
      requestId: 'request-1',
      error: 'Figma API unavailable',
    });
  });
});
