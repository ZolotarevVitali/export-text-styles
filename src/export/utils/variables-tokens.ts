import { rgbaToHex } from '../utils/color';
import { getVariableName, prepareVariableName } from '../utils/variable';
import { TTokens, TTokenValue } from '../types';

const DEFAULT_COLLECTION_NAME = 'variables';

export async function getVariablesTokens({
  fileExtension = 'json',
}: {
  fileExtension?: string;
}): Promise<Record<string, TTokens>> {
  //get all local variables
  const variables = await figma.variables.getLocalVariablesAsync();

  let tokens: Record<string, TTokens> = {};

  //get variable tokens for each variable
  for (const variable of variables) {
    tokens = await getVariableTokens(variable, tokens, fileExtension);
  }

  return tokens;
}

async function getVariableTokens(
  variable: Variable,
  tokens: Record<string, TTokens>,
  fileExtension: string
): Promise<Record<string, TTokens>> {
  //variable collection
  const collection = await figma.variables.getVariableCollectionByIdAsync(
    variable.variableCollectionId
  );

  if (!collection) {
    return {};
  }

  //get collection name for path
  const collectionName = collection.name
    ? collection.name.toLowerCase().replace(/\./g, '/')
    : DEFAULT_COLLECTION_NAME;

  //get modes from collection, not variable
  const collectionModes = collection.modes;

  //get variable tokens for each mode
  let modeNumber = 0;

  for (const mode of collectionModes) {
    const modeName = modeNumber > 0 ? mode.name : undefined;
    //get path for token
    const path = collectionName + '/' + prepareVariableName(mode.name) + '.' + fileExtension;
    //get variable token for mode
    const token = await getVariableToken(
      variable,
      mode.modeId,
      {
        ...tokens[path],
      },
      modeName
    );
    //merge token into tokens object
    tokens[path] = { ...tokens[path], ...token };
    modeNumber++;
  }

  return tokens;
}

//get the variable value by mode
async function getVariableValueByMode(variable: Variable, modeId: string) {
  const variableValueByMode = variable?.valuesByMode[modeId];

  //if the variable value is a VARIABLE_ALIAS, get the referenced variable
  if (
    typeof variableValueByMode === 'object' &&
    'type' in variableValueByMode &&
    variableValueByMode.type === 'VARIABLE_ALIAS' &&
    'id' in variableValueByMode &&
    variableValueByMode.id
  ) {
    const referencedVariable = await figma.variables.getVariableByIdAsync(variableValueByMode.id);
    if (referencedVariable) {
      //return the referenced variable name wrapped in curly braces
      return `{${getVariableName(referencedVariable)}}`;
    }
  }

  //if the variable type is a COLOR, return the color value
  if (variable.resolvedType === 'COLOR') {
    const colorObject = variable.valuesByMode[modeId] as {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    return rgbaToHex({ ...colorObject });
  }

  //if the variable type is a FLOAT, return the float value in px
  if (variable.resolvedType === 'FLOAT') {
    return getFloatValue(variable.name, variable.valuesByMode[modeId] as number);
  }

  //return the variable value by mode
  return variable.valuesByMode[modeId];
}

//get the float value in px or without px
function getFloatValue(name: string, value: number): string {
  //if the name includes 'font-weight', return the value without px
  if (name.includes('font-weight')) {
    return value.toString();
  }

  //if the name includes 'opacity', return the value divided by 100
  if (name.includes('opacity')) {
    return (value / 100).toString();
  }

  return value + 'px';
}

async function getVariableToken(
  variable: Variable,
  modeId: string,
  existingTokens: Record<string, TTokenValue> = {},
  modeName?: string
): Promise<Record<string, TTokenValue>> {
  //get the variable value by mode
  const tokenValue = {
    value: (await getVariableValueByMode(variable, modeId)) as string,
    type: variable.resolvedType as 'variable',
    mode: modeName,
  };

  //add the token to the existing tokens
  existingTokens[getVariableName(variable)] = tokenValue;

  return existingTokens;
}
