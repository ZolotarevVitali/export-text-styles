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
    const fileName = fileNamesByGroup.get(groupName);
    const mixinName = mixinNamesById.get(style.id);

    if (!fileName || !mixinName) {
      throw new Error(`Unable to prepare text style "${style.name}".`);
    }

    const preparedTextStyle: TPreparedTextStyle = {
      originalName: style.name,
      mixinName,
      'font-size': Number.isFinite(style.fontSize) ? `${style.fontSize}px` : null,
      'font-family': await getFontFamily({ style, variableMode }),
      'font-weight': await getFontWeight({ style, variableMode }),
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
    const matchingCandidates = candidatesByBaseName.get(candidate.baseName) ?? [];
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
      return `"${escapeScssString(variableValue)}", Arial, sans-serif`;
    }
  }

  return `"${escapeScssString(style.fontName.family)}", Arial, sans-serif`;
};

const getFontWeight = async ({
  style,
  variableMode,
}: {
  style: TFigmaTextStyle;
  variableMode: TVariableMode;
}): Promise<string | null> => {
  if (variableMode === 'name') {
    const variableName = await getVariableNameById(style.boundVariables?.fontWeight?.id);

    if (variableName) {
      return variableName;
    }
  }

  if (variableMode === 'value') {
    const variableValue = await getVariableValueById(style.boundVariables?.fontWeight?.id);
    const normalizedVariableValue = normalizeFontWeightValue(String(variableValue ?? ''));

    if (normalizedVariableValue) {
      return normalizedVariableValue;
    }
  }

  return normalizeFontWeightValue(style.fontName.style);
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
