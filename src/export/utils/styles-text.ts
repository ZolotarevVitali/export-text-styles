import { TFigmaTextStyle, TPreparedTextStyle } from '../types';

export async function getTextStyles({ useVariables }: { useVariables: boolean }) {
  const textStyles = await figma.getLocalTextStylesAsync();

  return prepareTextStyles({ textStyles, useVariables });
}

function prepareTextStyles({
  textStyles,
  useVariables,
}: {
  textStyles: TFigmaTextStyle[];
  useVariables: boolean;
}) {
  const preparedTextStyles: Record<string, TPreparedTextStyle[]> = {};

  textStyles.forEach((style) => {
    const fileName = getTextStyleFileName(style.name);

    const preparedTextStyle = {
      originalName: style.name,
      mixinName: getTextStyleMixinName(style.name),
      fontSize: style.fontSize + 'px',
    };

    if (!preparedTextStyles[fileName]) {
      preparedTextStyles[fileName] = [];
    }

    preparedTextStyles[fileName].push(preparedTextStyle);
  });

  return preparedTextStyles;
}

function getTextStyleMixinName(name: string) {
  const normalizedName = normalizeName(name);
  return 'text-style-' + normalizedName + '-mixin';
}

function getTextStyleFileName(name: string) {
  const fileName = name.split('/')[0];
  const normalizedName = normalizeName(fileName);
  return normalizedName + '.scss';
}

function normalizeName(name: string) {
  return name
    .replace(/[\s/()]+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-');
}
