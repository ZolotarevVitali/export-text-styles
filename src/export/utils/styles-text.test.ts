import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TFigmaTextStyle } from '../types';
import { getTextStyles, prepareTextStyles } from './styles-text';

const createStyle = (overrides: Partial<TFigmaTextStyle> = {}): TFigmaTextStyle => ({
  id: 'style-1',
  name: 'Body/Regular',
  fontSize: 16,
  fontName: { family: 'Inter', style: 'Regular' },
  lineHeight: { value: 24, unit: 'PIXELS' },
  letterSpacing: { value: 0, unit: 'PIXELS' },
  textCase: 'ORIGINAL',
  textDecoration: 'NONE',
  paragraphIndent: 0,
  ...overrides,
});

const getOnlyStyle = (styles: Awaited<ReturnType<typeof prepareTextStyles>>) => {
  return Object.values(styles).flat()[0];
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('text style loading and edge normalization', () => {
  it('loads local styles through the asynchronous Figma API', async () => {
    const textStyle = createStyle();
    const getLocalTextStylesAsync = vi.fn(async () => [textStyle]);
    vi.stubGlobal('figma', { getLocalTextStylesAsync });

    const result = await getTextStyles({ variableMode: 'none' });

    expect(getLocalTextStylesAsync).toHaveBeenCalledOnce();
    expect(result['body.scss'][0].originalName).toBe('Body/Regular');
  });

  it('keeps the exact Figma style name while preparing normalized identifiers', async () => {
    const preparedStyle = getOnlyStyle(
      await prepareTextStyles({
        textStyles: [createStyle({ name: 'Text/Body/3XL/- bold (AB)' })],
        variableMode: 'none',
      }),
    );

    expect(preparedStyle.originalName).toBe('Text/Body/3XL/- bold (AB)');
    expect(preparedStyle.mixinName).toBe('text-style-text-body-3xl-bold-ab-mixin');
  });

  it('falls back to style values when variable names cannot be resolved', async () => {
    vi.stubGlobal('figma', {
      variables: {
        getVariableByIdAsync: vi.fn(async () => null),
        getVariableCollectionByIdAsync: vi.fn(async () => null),
      },
    });
    const missingBinding = { id: 'missing' };
    const preparedStyle = getOnlyStyle(
      await prepareTextStyles({
        textStyles: [
          createStyle({
            boundVariables: {
              fontSize: missingBinding,
              fontFamily: missingBinding,
              fontWeight: missingBinding,
              lineHeight: missingBinding,
              letterSpacing: missingBinding,
              fontStyle: missingBinding,
              paragraphIndent: missingBinding,
            },
          }),
        ],
        variableMode: 'name',
      }),
    );

    expect(preparedStyle).toMatchObject({
      'font-size': '16px',
      'font-family': '"Inter"',
      'font-weight': '400',
      'line-height': '24px',
      'letter-spacing': '0px',
      'font-style': 'normal',
      'text-indent': '0px',
    });
  });

  it('falls back when variable values have unsupported property types', async () => {
    const values: Record<string, VariableValue> = {
      letter: 'wide',
      style: 1,
      indent: 'deep',
    };
    vi.stubGlobal('figma', {
      variables: {
        getVariableByIdAsync: vi.fn(async (id: string) => ({
          id,
          name: id,
          variableCollectionId: 'collection',
          valuesByMode: { default: values[id] },
        })),
        getVariableCollectionByIdAsync: vi.fn(async () => ({ defaultModeId: 'default' })),
      },
    });
    const preparedStyle = getOnlyStyle(
      await prepareTextStyles({
        textStyles: [
          createStyle({
            boundVariables: {
              letterSpacing: { id: 'letter' },
              fontStyle: { id: 'style' },
              paragraphIndent: { id: 'indent' },
            },
          }),
        ],
        variableMode: 'value',
      }),
    );

    expect(preparedStyle['letter-spacing']).toBe('0px');
    expect(preparedStyle['font-style']).toBe('normal');
    expect(preparedStyle['text-indent']).toBe('0px');
  });

  it('rounds numeric typography values to four decimal places', async () => {
    const preparedStyle = getOnlyStyle(
      await prepareTextStyles({
        textStyles: [
          createStyle({
            fontSize: 16.123456,
            lineHeight: { value: 120.00000476837158, unit: 'PERCENT' },
            letterSpacing: { value: 1.23456, unit: 'PIXELS' },
            paragraphIndent: 8.7654321,
          }),
        ],
        variableMode: 'none',
      }),
    );

    expect(preparedStyle).toMatchObject({
      'font-size': '16.1235px',
      'line-height': '120%',
      'letter-spacing': '1.2346px',
      'text-indent': '8.7654px',
    });
  });

  it('omits non-finite numbers, blank styles, and unsupported text transforms', async () => {
    const preparedStyle = getOnlyStyle(
      await prepareTextStyles({
        textStyles: [
          createStyle({
            fontSize: Number.NaN,
            fontName: { family: 'Inter', style: '   ' },
            lineHeight: { value: Number.POSITIVE_INFINITY, unit: 'PIXELS' },
            letterSpacing: { value: Number.NEGATIVE_INFINITY, unit: 'PERCENT' },
            paragraphIndent: Number.NaN,
            textCase: 'SMALL_CAPS_FORCED',
          }),
        ],
        variableMode: 'none',
      }),
    );

    expect(preparedStyle).toMatchObject({
      'font-size': null,
      'font-weight': null,
      'line-height': null,
      'letter-spacing': null,
      'font-style': null,
      'text-transform': null,
      'text-indent': null,
    });
  });

  it('maps lowercase text and exercises duplicate-name collision fallback', async () => {
    const preparedStyles = await prepareTextStyles({
      textStyles: [
        createStyle({ textCase: 'LOWER' }),
        createStyle({ textCase: 'LOWER' }),
      ],
      variableMode: 'none',
    });
    const styles = Object.values(preparedStyles).flat();

    expect(styles).toHaveLength(2);
    expect(styles[0]['text-transform']).toBe('lowercase');
    expect(styles[0].mixinName).toBe(styles[1].mixinName);
    expect(styles[0].mixinName).toMatch(/-2$/);
  });
});
