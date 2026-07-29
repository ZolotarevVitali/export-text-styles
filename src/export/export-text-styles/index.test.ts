import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTextStyles } from '../utils/styles-text';
import {
  buildTextStyleFiles,
  exportTextStyles,
  getIndexFileContent,
  getTextStyleMixinContent,
} from '.';

vi.mock('../utils/styles-text', () => ({
  getTextStyles: vi.fn(),
}));

const preparedStyle = {
  originalName: 'Body/Regular',
  mixinName: 'text-style-body-regular-mixin',
  'font-size': '16px',
  'font-family': '"Inter", Arial, sans-serif',
  'font-weight': null,
  'line-height': 'normal',
  'letter-spacing': null,
  'font-style': 'normal',
  'text-transform': 'none',
  'text-decoration': 'none',
  'text-indent': '0px',
};

beforeEach(() => {
  vi.mocked(getTextStyles).mockReset();
});

describe('text style file export', () => {
  it('loads prepared styles and builds the export files', async () => {
    vi.mocked(getTextStyles).mockResolvedValue({ 'body.scss': [preparedStyle] });

    const files = await exportTextStyles({ variableMode: 'value' });

    expect(getTextStyles).toHaveBeenCalledWith({ variableMode: 'value' });
    expect(files).toEqual({
      'body.scss': getTextStyleMixinContent(preparedStyle),
      'index.scss': "@import './body';\n",
    });
  });

  it('returns null when there are no groups', () => {
    expect(buildTextStyleFiles({})).toBeNull();
  });

  it('joins multiple mixins and omits null properties', () => {
    const secondStyle = {
      ...preparedStyle,
      originalName: 'Body/Bold',
      mixinName: 'text-style-body-bold-mixin',
      'font-weight': '700',
    };
    const files = buildTextStyleFiles({ 'body.scss': [preparedStyle, secondStyle] });

    expect(files?.['body.scss']).toBe(
      `${getTextStyleMixinContent(preparedStyle)}\n\n${getTextStyleMixinContent(secondStyle)}`,
    );
    expect(getTextStyleMixinContent(preparedStyle)).not.toContain('font-weight');
  });

  it('creates a stable multi-file import index', () => {
    expect(
      getIndexFileContent({
        'heading.scss': [preparedStyle],
        'body.scss': [preparedStyle],
      }),
    ).toBe("@import './heading';\n@import './body';\n");
  });
});
