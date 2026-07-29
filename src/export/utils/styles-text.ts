import { TFigmaTextStyle, TPreparedTextStyle } from '../types';
import { getVariableNameById } from './variable';
import { CSS_FONT_WEIGHTS } from '../constants';

/** Loads local Figma text styles and prepares them for SCSS generation. */
export async function getTextStyles({ useVariables }: { useVariables: boolean }) {
  const textStyles = await figma.getLocalTextStylesAsync();

  return await prepareTextStyles({ textStyles, useVariables });
}

/** Groups prepared styles by the first segment of their Figma style name. */
async function prepareTextStyles({
  textStyles,
  useVariables,
}: {
  textStyles: TFigmaTextStyle[];
  useVariables: boolean;
}) {
  const preparedTextStyles: Record<string, TPreparedTextStyle[]> = {};

  for (const style of textStyles) {
    const fileName = getTextStyleFileName(style.name);
    //console.log(style);

    const preparedTextStyle = {
      originalName: style.name,
      mixinName: getTextStyleMixinName(style.name),
      'font-size': style.fontSize ? style.fontSize + 'px' : null,
      'font-family': await getFontFamily({ style, useVariables }),
      'font-weight': await getFontWeight({ style, useVariables }),
    };

    if (!preparedTextStyles[fileName]) {
      preparedTextStyles[fileName] = [];
    }

    preparedTextStyles[fileName].push(preparedTextStyle);
  }

  return preparedTextStyles;
}

/** Creates a unique SCSS mixin name from the full Figma style name. */
function getTextStyleMixinName(name: string) {
  const normalizedName = normalizeName(name);
  return 'text-style-' + normalizedName + '-mixin';
}

/** Uses the top-level Figma style group as the output SCSS file name. */
function getTextStyleFileName(name: string) {
  const fileName = name.split('/')[0];
  const normalizedName = normalizeName(fileName);
  return normalizedName + '.scss';
}

/** Converts Figma naming separators into a lowercase, kebab-case identifier. */
function normalizeName(name: string) {
  return name
    .replace(/[\s/()]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-');
}

async function getFontFamily({
  style,
  useVariables,
}: {
  style: TFigmaTextStyle;
  useVariables: boolean;
}): Promise<string | null> {
  const variableName = await getVariableNameById(style?.boundVariables?.fontFamily?.id);

  // Prefer the bound Figma variable when variable-based output is enabled.
  return useVariables && variableName
    ? variableName
    : `'${style.fontName.family}', Arial, sans-serif` || null;
}

async function getFontWeight({
  style,
  useVariables,
}: {
  style: TFigmaTextStyle;
  useVariables: boolean;
}): Promise<string | null> {
  const variableName = await getVariableNameById(style?.boundVariables?.fontWeight?.id);

  // Fall back to the text style value when no usable variable is bound.
  if (useVariables && variableName) {
    return variableName;
  }

  return normalizeFontWeightValue(style?.fontName?.style);
}

/** Maps Figma font style labels and numeric weights to valid CSS weights. */
function normalizeFontWeightValue(fontWeight: string | undefined): string | null {
  const normalizedFontWeight = fontWeight
    ?.toLowerCase()
    .replace(/italic|oblique/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (!normalizedFontWeight) {
    return null;
  }

  if (/^[1-9]00$/.test(normalizedFontWeight)) {
    return normalizedFontWeight;
  }

  return CSS_FONT_WEIGHTS[normalizedFontWeight] ?? null;
}
