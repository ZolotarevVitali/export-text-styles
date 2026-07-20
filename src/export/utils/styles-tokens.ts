import { TTokens } from '../types';
import { rgbToHex } from '../utils/color';
import { IColorToken } from '../interfaces';
import { prepareVariableName } from '../utils/variable';

const FILE_PATH = 'styles/style.json';

export async function getStylesTokens({
  filePath = FILE_PATH,
}: {
  filePath?: string;
}): Promise<Record<string, TTokens>> {
  //paint styles and effect styles
  const paintStylesTokens = await getPaintStyles();
  //const effectStylesTokens = await getEffectStyles();

  return { [filePath]: paintStylesTokens };
}

//get paint styles
async function getPaintStyles() {
  // Get all paint styles (colors and gradients)
  const paintStyles = await figma.getLocalPaintStylesAsync();
  const variables = await figma.variables.getLocalVariablesAsync();

  // Initialize the tokens object
  const tokens: TTokens = {};

  // Create a map of variable IDs to names for quick lookup
  const variableMap = new Map<string, string>();
  variables.forEach((variable) => {
    variableMap.set(variable.id, variable.name);
  });

  // Process each paint style
  for (const style of paintStyles) {
    const styleName = prepareVariableName(style.name);
    const paints = style.paints;
    if (paints.length === 0) continue;

    const paint = paints[0];

    // Handle different paint types
    if (paint.type === 'SOLID') {
      // Check if this is a variable reference
      if ('boundVariables' in paint && paint.boundVariables?.color) {
        const variableId = paint.boundVariables.color.id;
        const variableName = variableMap.get(variableId);

        if (variableName) {
          // Use variable name instead of color value

          tokens[styleName] = {
            value: `{${prepareVariableName(variableName)}}`,
            type: 'color',
          } as IColorToken;
        }
      }

      // Handle regular solid colors
      const color = paint.color;
      const opacity = paint.opacity || 1;
      const hexColor = rgbToHex(color.r, color.g, color.b);

      // Add to tokens with opacity
      const value =
        opacity < 1
          ? `${hexColor}${Math.round(opacity * 255)
              .toString(16)
              .padStart(2, '0')}`
          : hexColor;

      tokens[styleName] = {
        value,
        type: 'color',
      } as IColorToken;
    } else if (paint.type === 'GRADIENT_LINEAR') {
      // Handle linear gradients
      const gradient = paint;
      const stops = gradient.gradientStops
        .map((stop) => {
          // Check if this stop is a variable reference
          if ('boundVariables' in stop && stop.boundVariables?.color) {
            const variableId = stop.boundVariables.color.id;
            const variableName = variableMap.get(variableId);
            if (variableName) {
              return `{${prepareVariableName(variableName)}} ${Math.round(stop.position * 100)}%`;
            }
          }

          // Regular color stop
          const color = stop.color;
          const hexColor = rgbToHex(color.r, color.g, color.b);
          return `${hexColor} ${Math.round(stop.position * 100)}%`;
        })
        .join(', ');

      // Calculate gradient angle from transform matrix
      const transform = gradient.gradientTransform;
      // Get the direction vector from the transform matrix
      const dx = transform[0][0];
      const dy = transform[1][0];
      // Calculate the angle in radians
      const angleRad = Math.atan2(dy, dx);
      // Convert to degrees and normalize to 0-360
      let angleDeg = ((angleRad * 180) / Math.PI) % 360;
      if (angleDeg < 0) angleDeg += 360;
      // Convert to CSS angle (0deg is right, 90deg is up)
      // For Figma gradients, we need to invert the angle and add 90 degrees
      const cssAngle = (360 - angleDeg + 90) % 360;

      const value = `linear-gradient(${Math.round(cssAngle)}deg, ${stops})`;

      tokens[styleName] = {
        value,
        type: 'color',
      } as IColorToken;
    }
  }

  return tokens;
}

// async function getEffectStyles() {
//   // Get effect styles (shadows)
//   const effectStyles = await figma.getLocalEffectStylesAsync();
//   const variables = await figma.variables.getLocalVariablesAsync();

//   // Initialize the tokens object
//   const tokens: TTokens = {};

//   // Create a map of variable IDs to names for quick lookup
//   const variableMap = new Map<string, string>();
//   variables.forEach((variable) => {
//     variableMap.set(variable.id, variable.name);
//   });

//   for (const style of effectStyles) {
//     const styleName = prepareVariableName(style.name);
//     const effects = style.effects;
//     if (effects.length === 0) continue;

//     const effect = effects[0];
//     if (effect.type === 'DROP_SHADOW') {
//       // Check if shadow color is a variable reference
//       let colorValue: string;
//       if ('boundVariables' in effect && effect.boundVariables?.color) {
//         const variableId = effect.boundVariables.color.id;
//         const variableName = variableMap.get(variableId);
//         colorValue = variableName
//           ? `{${variableName}}`
//           : rgbToHex(effect.color.r, effect.color.g, effect.color.b);
//       } else {
//         colorValue = rgbToHex(effect.color.r, effect.color.g, effect.color.b);
//       }

//       const shadowValue: IShadowValue = {
//         color: colorValue,
//         type: 'dropShadow',
//         x: effect.offset.x,
//         y: effect.offset.y,
//         blur: effect.radius,
//         spread: effect.spread || 0,
//       };

//       // Add the shadow to the shadows group
//       tokens[styleName] = {
//         value: shadowValue,
//         type: 'boxShadow',
//       };
//     }
//   }

//   return tokens;
// }
