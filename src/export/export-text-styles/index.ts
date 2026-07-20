import { TPreparedTextStyle } from '../types';
import { getTextStyles } from '../utils/styles-text';

export async function exportTextStyles({ useVariables }: { useVariables: boolean }) {
  const textStyles = await getTextStyles({ useVariables });

  const textStylesFiles: Record<string, string> = {};

  Object.entries(textStyles).forEach(([fileName, textStyles]) => {
    textStylesFiles[fileName] = getTextStylesFileContent(textStyles);
  });

  return { ...textStylesFiles, 'index.scss': getIndexFileContent(textStyles) };
}

function getTextStylesFileContent(textStyles: TPreparedTextStyle[]) {
  return textStyles
    .map((textStyle) => {
      return getTextStyleMixinContent(textStyle);
    })
    .join('\n\n');
}

function getTextStyleMixinContent(textStyle: TPreparedTextStyle) {
  const { mixinName, originalName, ...props } = textStyle;
  const description = `/*figma style name: ${originalName}*/\n`;
  const mixinContent = Object.entries(props)
    .map(([key, value]) => `\t${key}: ${value};`)
    .join('\n');
  return `${description}@mixin ${mixinName} {\n${mixinContent}\n}`;
}

function getIndexFileContent(textStyles: Record<string, TPreparedTextStyle[]>): string {
  let fileContent = '';

  for (const key of Object.keys(textStyles)) {
    fileContent += `@import './${key.replace('.scss', '')}';\n`;
  }
  return fileContent;
}
