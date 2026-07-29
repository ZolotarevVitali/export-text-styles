import { TPreparedTextStyle, TTextStyleFiles } from '../types';
import { getTextStyles } from '../utils/styles-text';
import { escapeScssComment } from '../utils/scss';
import type { TVariableMode } from '../../messages';

const formatFigmaStyleLabel = (name: string): string => {
  return name.replace(/\s*\/\s*-?\s*/g, ' -/- ');
};

/** Builds the SCSS mixin files and their shared index from local text styles. */
export const exportTextStyles = async ({
  variableMode,
}: {
  variableMode: TVariableMode;
}): Promise<TTextStyleFiles | null> => {
  const textStyles = await getTextStyles({ variableMode });

  return buildTextStyleFiles(textStyles);
};

export const buildTextStyleFiles = (
  textStyles: Record<string, TPreparedTextStyle[]>,
): TTextStyleFiles | null => {
  if (Object.keys(textStyles).length === 0) {
    return null;
  }

  const textStylesFiles: TTextStyleFiles = {};

  Object.entries(textStyles).forEach(([fileName, textStyles]) => {
    textStylesFiles[fileName] = getTextStylesFileContent(textStyles);
  });

  return { ...textStylesFiles, 'index.scss': getIndexFileContent(textStyles) };
};

/** Joins all generated mixins assigned to a single SCSS file. */
const getTextStylesFileContent = (textStyles: TPreparedTextStyle[]): string => {
  return textStyles
    .map((textStyle) => getTextStyleMixinContent(textStyle))
    .join('\n\n');
};

/** Serializes one prepared text style as a documented SCSS mixin. */
export const getTextStyleMixinContent = (textStyle: TPreparedTextStyle): string => {
  const { mixinName, originalName, ...props } = textStyle;
  const styleLabel = formatFigmaStyleLabel(originalName);
  const description = `/*figma style name: ${escapeScssComment(styleLabel)}*/\n`;
  const mixinContent = Object.entries(props)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `\t${key}: ${value};`)
    .join('\n');

  return `${description}@mixin ${mixinName} {\n${mixinContent}\n}`;
};

/** Generates an index that imports every text-style SCSS file. */
export const getIndexFileContent = (
  textStyles: Record<string, TPreparedTextStyle[]>,
): string => {
  return Object.keys(textStyles)
    .map((fileName) => `@import './${fileName.replace(/\.scss$/, '')}';`)
    .join('\n')
    .concat('\n');
};
