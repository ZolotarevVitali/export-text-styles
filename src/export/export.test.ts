import { compileString } from 'sass';
import { describe, expect, it } from 'vitest';
import { handleExportRequest } from '../export-request';
import { buildTextStyleFiles } from './export-text-styles';
import { TFigmaTextStyle } from './types';
import { normalizeFontWeightValue, prepareTextStyles } from './utils/styles-text';

const createTextStyle = ({
  id,
  name,
  fontFamily = 'Inter',
  fontStyle = 'Regular',
}: {
  id: string;
  name: string;
  fontFamily?: string;
  fontStyle?: string;
}): TFigmaTextStyle => ({
  id,
  name,
  fontSize: 16,
  fontName: {
    family: fontFamily,
    style: fontStyle,
  },
});

describe('text style preparation', () => {
  it('reserves index.scss for the generated import index', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [createTextStyle({ id: 'index-title', name: 'Index/Title' })],
      useVariables: false,
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
    const firstResult = await prepareTextStyles({ textStyles: styles, useVariables: false });
    const secondResult = await prepareTextStyles({
      textStyles: [...styles].reverse(),
      useVariables: false,
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
      useVariables: false,
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
      useVariables: false,
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
      useVariables: false,
    });
    const emptyGroup = await prepareTextStyles({
      textStyles: [createTextStyle({ id: 'empty', name: '/Caption' })],
      useVariables: false,
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
      useVariables: false,
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
        useVariables: false,
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
