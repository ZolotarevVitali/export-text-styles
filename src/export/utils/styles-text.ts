import { TFigmaTextStyle, TPreparedTextStyle } from '../types';
import { getVariableNameById, getVariableValueById } from './variable';
import { CSS_FONT_WEIGHTS } from '../constants';
import { escapeScssString, getStableSuffix, normalizeScssIdentifier } from './scss';
import type { TVariableMode } from '../../messages';

type TNameCandidate = {
  key: string;
  baseName: string;
  discriminator: string;
};

/** Loads local Figma text styles and prepares them for SCSS generation. */
export const getTextStyles = async ({
  variableMode,
}: {
  variableMode: TVariableMode;
}): Promise<Record<string, TPreparedTextStyle[]>> => {
  const textStyles = await figma.getLocalTextStylesAsync();

  return prepareTextStyles({ textStyles, variableMode });
};

/** Groups prepared styles by the first segment of their Figma style name. */
export const prepareTextStyles = async ({
  textStyles,
  variableMode,
}: {
  textStyles: TFigmaTextStyle[];
  variableMode: TVariableMode;
}): Promise<Record<string, TPreparedTextStyle[]>> => {
  const preparedTextStyles: Record<string, TPreparedTextStyle[]> = {};
  const fileNamesByGroup = getTextStyleFileNames(textStyles);
  const mixinNamesById = getTextStyleMixinNames(textStyles);

  for (const style of textStyles) {
    const groupName = getTextStyleGroupName(style.name);
    const fileName = fileNamesByGroup.get(groupName)!;
    const mixinName = mixinNamesById.get(style.id)!;

    const preparedTextStyle: TPreparedTextStyle = {
      originalName: style.name,
      mixinName,
      'font-size': await getFontSize({ style, variableMode }),
      'font-family': await getFontFamily({ style, variableMode }),
      'font-weight': await getFontWeight({ style, variableMode }),
      'line-height': await getLineHeight({ style, variableMode }),
      'letter-spacing': await getLetterSpacing({ style, variableMode }),
      'font-style': await getFontStyle({ style, variableMode }),
      'text-transform': normalizeTextTransformValue(style.textCase),
      'text-decoration': normalizeTextDecorationValue(style.textDecoration),
      'text-indent': await getTextIndent({ style, variableMode }),
    };

    if (!preparedTextStyles[fileName]) {
      preparedTextStyles[fileName] = [];
    }

    preparedTextStyles[fileName].push(preparedTextStyle);
  }

  return preparedTextStyles;
};

const getTextStyleGroupName = (name: string): string => {
  return name.split('/')[0];
};

const getTextStyleFileNames = (textStyles: TFigmaTextStyle[]): Map<string, string> => {
  const groupNames = Array.from(new Set(textStyles.map(({ name }) => getTextStyleGroupName(name))));
  const candidates = groupNames.map((groupName) => ({
    key: groupName,
    baseName: normalizeScssIdentifier(groupName),
    discriminator: groupName,
  }));

  const uniqueNames = getUniqueNames(candidates, new Set(['index']));

  return new Map(Array.from(uniqueNames, ([groupName, fileName]) => [groupName, `${fileName}.scss`]));
};

const getTextStyleMixinNames = (textStyles: TFigmaTextStyle[]): Map<string, string> => {
  const candidates = textStyles.map((style) => ({
    key: style.id,
    baseName: `text-style-${normalizeScssIdentifier(style.name)}-mixin`,
    discriminator: `${style.name}:${style.id}`,
  }));

  return getUniqueNames(candidates);
};

const getUniqueNames = (
  candidates: TNameCandidate[],
  reservedNames: Set<string> = new Set(),
): Map<string, string> => {
  const candidatesByBaseName = new Map<string, TNameCandidate[]>();

  for (const candidate of candidates) {
    const matchingCandidates = candidatesByBaseName.get(candidate.baseName) ?? [];
    matchingCandidates.push(candidate);
    candidatesByBaseName.set(candidate.baseName, matchingCandidates);
  }

  const uniqueNames = new Map<string, string>();
  const usedNames = new Set<string>(reservedNames);

  for (const candidate of [...candidates].sort((first, second) =>
    first.discriminator.localeCompare(second.discriminator),
  )) {
    const matchingCandidates = candidatesByBaseName.get(candidate.baseName)!;
    const needsSuffix = matchingCandidates.length > 1 || reservedNames.has(candidate.baseName);
    const suffixedName = `${candidate.baseName}-${getStableSuffix(candidate.discriminator)}`;
    const desiredName = needsSuffix ? suffixedName : candidate.baseName;
    let uniqueName = desiredName;
    let duplicateIndex = 2;

    while (usedNames.has(uniqueName)) {
      uniqueName = `${desiredName}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedNames.add(uniqueName);
    uniqueNames.set(candidate.key, uniqueName);
  }

  return uniqueNames;
};

const getFontSize = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.fontSize?.id,
    fallbackValue: normalizePixelValue(style.fontSize),
    normalizeVariableValue: (value) =>
      typeof value === 'number' ? normalizePixelValue(value) : null,
  });
};

const getFontFamily = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  if (variableMode === 'name') {
    const variableName = await getVariableNameById(style.boundVariables?.fontFamily?.id);

    if (variableName) {
      return variableName;
    }
  }

  if (variableMode === 'value') {
    const variableValue = await getVariableValueById(style.boundVariables?.fontFamily?.id);

    if (typeof variableValue === 'string' && variableValue) {
      return `"${escapeScssString(variableValue)}"`;
    }
  }

  return `"${escapeScssString(style.fontName.family)}"`;
};

const getFontWeight = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.fontWeight?.id,
    fallbackValue: normalizeFontWeightValue(style.fontName.style),
    normalizeVariableValue: (value) => normalizeFontWeightValue(String(value)),
  });
};

const getLineHeight = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.lineHeight?.id,
    fallbackValue: normalizeLineHeightValue(style.lineHeight),
    normalizeVariableValue: (value) => {
      if (typeof value !== 'number' || style.lineHeight.unit === 'AUTO') {
        return null;
      }

      return normalizeNumericUnitValue(value, style.lineHeight.unit);
    },
  });
};

const getLetterSpacing = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.letterSpacing?.id,
    fallbackValue: normalizeLetterSpacingValue(style.letterSpacing),
    normalizeVariableValue: (value) =>
      typeof value === 'number'
        ? normalizeNumericUnitValue(value, style.letterSpacing.unit, true)
        : null,
  });
};

const getFontStyle = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.fontStyle?.id,
    fallbackValue: normalizeFontStyleValue(style.fontName.style),
    normalizeVariableValue: (value) =>
      typeof value === 'string' ? normalizeFontStyleValue(value) : null,
  });
};

const getTextIndent = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  return getVariableAwareValue({
    variableMode,
    variableId: style.boundVariables?.paragraphIndent?.id,
    fallbackValue: normalizePixelValue(style.paragraphIndent),
    normalizeVariableValue: (value) =>
      typeof value === 'number' ? normalizePixelValue(value) : null,
  });
};

const getVariableAwareValue = async ({
  variableMode,
  variableId,
  fallbackValue,
  normalizeVariableValue,
}: {
  variableMode: TVariableMode;
  variableId?: string;
  fallbackValue: string | null;
  normalizeVariableValue: (value: string | number) => string | null;
}): Promise<string | null> => {
  if (variableMode === 'name') {
    return (await getVariableNameById(variableId)) ?? fallbackValue;
  }

  if (variableMode === 'value') {
    const variableValue = await getVariableValueById(variableId);

    if (variableValue !== null) {
      return normalizeVariableValue(variableValue) ?? fallbackValue;
    }
  }

  return fallbackValue;
};

const normalizeLineHeightValue = (lineHeight: TFigmaTextStyle['lineHeight']): string | null => {
  if (lineHeight.unit === 'AUTO') {
    return 'normal';
  }

  return normalizeNumericUnitValue(lineHeight.value, lineHeight.unit);
};

const normalizeLetterSpacingValue = (
  letterSpacing: TFigmaTextStyle['letterSpacing'],
): string | null => {
  return normalizeNumericUnitValue(letterSpacing.value, letterSpacing.unit, true);
};

const normalizeNumericUnitValue = (
  value: number,
  unit: 'PIXELS' | 'PERCENT',
  convertPercentToEm = false,
): string | null => {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (unit === 'PIXELS') {
    return `${formatCssNumber(value)}px`;
  }

  return convertPercentToEm
    ? `${formatCssNumber(value / 100)}em`
    : `${formatCssNumber(value)}%`;
};

const normalizePixelValue = (value: number): string | null => {
  return Number.isFinite(value) ? `${formatCssNumber(value)}px` : null;
};

const formatCssNumber = (value: number): string => {
  return String(Number(value.toFixed(4)));
};

const normalizeFontStyleValue = (fontStyle: string | undefined): string | null => {
  const normalizedFontStyle = fontStyle?.trim().toLowerCase();

  if (!normalizedFontStyle) {
    return null;
  }

  if (normalizedFontStyle.includes('oblique')) {
    return 'oblique';
  }

  return normalizedFontStyle.includes('italic') ? 'italic' : 'normal';
};

const normalizeTextTransformValue = (
  textCase: TFigmaTextStyle['textCase'],
): string | null => {
  const textTransforms: Partial<Record<TFigmaTextStyle['textCase'], string>> = {
    ORIGINAL: 'none',
    UPPER: 'uppercase',
    LOWER: 'lowercase',
    TITLE: 'capitalize',
  };

  return textTransforms[textCase] ?? null;
};

const normalizeTextDecorationValue = (
  textDecoration: TFigmaTextStyle['textDecoration'],
): string => {
  const textDecorations: Record<TFigmaTextStyle['textDecoration'], string> = {
    NONE: 'none',
    UNDERLINE: 'underline',
    STRIKETHROUGH: 'line-through',
  };

  return textDecorations[textDecoration];
};

/** Maps Figma font style labels and numeric weights to valid CSS weights. */
export const normalizeFontWeightValue = (fontWeight: string | undefined): string | null => {
  const normalizedFontWeight = fontWeight
    ?.toLowerCase()
    .replace(/italic|oblique/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (!normalizedFontWeight) {
    return null;
  }

  if (/^\d{1,4}$/.test(normalizedFontWeight)) {
    const numericFontWeight = Number(normalizedFontWeight);

    if (numericFontWeight >= 1 && numericFontWeight <= 1000) {
      return normalizedFontWeight;
    }
  }

  return CSS_FONT_WEIGHTS[normalizedFontWeight] ?? null;
};
