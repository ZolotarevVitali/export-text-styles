import { TPreparedTextStyle } from '../types';
import { getTextStyles } from '../utils/styles-text';

/** Builds the SCSS mixin files and their shared index from local text styles. */
export async function exportTextStyles({ useVariables }: { useVariables: boolean }) {
  const textStyles = await getTextStyles({ useVariables });

  const textStylesFiles: Record<string, string> = {};

  if (Object.keys(textStyles).length === 0) {
    return null;
  }

  Object.entries(textStyles).forEach(([fileName, textStyles]) => {
    textStylesFiles[fileName] = getTextStylesFileContent(textStyles);
  });

  return { ...textStylesFiles, 'index.scss': getIndexFileContent(textStyles) };
}

/** Joins all generated mixins assigned to a single SCSS file. */
function getTextStylesFileContent(textStyles: TPreparedTextStyle[]) {
  return textStyles
    .map((textStyle) => {
      return getTextStyleMixinContent(textStyle);
    })
    .join('\n\n');
}

/** Serializes one prepared text style as a documented SCSS mixin. */
function getTextStyleMixinContent(textStyle: TPreparedTextStyle) {
  const { mixinName, originalName, ...props } = textStyle;
  const description = `/*figma style name: ${originalName}*/\n`;
  const mixinContent = Object.entries(props)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `\t${key}: ${value};`)
    .join('\n');
  return `${description}@mixin ${mixinName} {\n${mixinContent}\n}`;
}

/** Generates an index that imports every text-style SCSS file. */
function getIndexFileContent(textStyles: Record<string, TPreparedTextStyle[]>): string {
  let fileContent = '';

  for (const key of Object.keys(textStyles)) {
    fileContent += `@import './${key.replace('.scss', '')}';\n`;
  }
  return fileContent;
}
