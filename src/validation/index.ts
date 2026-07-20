import {
  getOriginalVariableName,
  getOriginalStyleName,
  prepareVariableName,
} from '../export/utils/variable';

const ERRORS_MESSAGES: Record<string, string> = {
  errorsDoubleTokens: 'Double tokens names found',
  errorsIncorrectNames:
    'Incorrect name found. The name must contain only lowercase letters, numbers, and hyphens',
  errorsIncorrectReferences: 'Incorrect reference found',
};

export async function validateTokens() {
  //get all local variables
  const variables = await figma.variables.getLocalVariablesAsync();
  //get all local styles
  const styles = await figma.getLocalPaintStylesAsync();
  //variable names
  const variableNames = getVariableNames(variables);
  //style names
  const styleNames = getStyleNames(styles);
  //combined names
  const combinedNames = [...variableNames, ...styleNames];

  //get errors of double tokens
  const errorsDoubleTokens = getErrorsDoubleTokens(combinedNames);
  //get errors of incorrect names
  const errorsIncorrectNames = getErrorsIncorrectNames(combinedNames);
  //get errors of incorrect references
  const errorsIncorrectReferences = await getErrorsIncorrectReferences(
    variables,
    styles,
    variableNames
  );

  const fileContent = getFileContent({
    errorsDoubleTokens,
    errorsIncorrectNames,
    errorsIncorrectReferences,
  });

  if (!fileContent) {
    return {
      success: true,
      message: 'Validation completed successfully',
    };
  }

  return {
    success: false,
    message: 'Validation completed with errors',
    fileContent,
  };
}

//get file content
function getFileContent(props: Record<string, string[]>): string {
  let fileContent = '';

  Object.entries(props).forEach(([key, value]) => {
    if (value.length > 0) {
      fileContent += `${ERRORS_MESSAGES[key]}: \n\t${value.join('\n\t')}\n`;
    }
  });

  return fileContent;
}

//get variable names
export function getVariableNames(variables: Variable[]): string[] {
  //get variable names
  return variables.map((variable) => getOriginalVariableName(variable));
}

//get styles names
export function getStyleNames(styles: PaintStyle[]): string[] {
  //get style names
  return styles.map((style) => getOriginalStyleName(style));
}

// Get the errors of double tokens
function getErrorsDoubleTokens(tokens: string[]) {
  return tokens.filter((token, index, self) => self.indexOf(token) !== index);
}

// Get the errors of incorrect names
function getErrorsIncorrectNames(tokens: string[]) {
  const reCorrectName = /^[a-zA-Z0-9-]+(\[[\w-]+\])?$/;

  console.log(tokens);

  return tokens.filter((token) => !reCorrectName.test(token));
}

// Get the errors of incorrect references
async function getErrorsIncorrectReferences(
  variables: Variable[],
  styles: PaintStyle[],
  variableNames: string[]
) {
  const errors = [];

  //check variable references
  for (const variable of variables) {
    //check the variable reference
    const errorReferences = await checkVariableReference(variable, variableNames);
    //if there are errors, add to errors
    if (errorReferences.length > 0) {
      errors.push(...errorReferences);
    }
  }

  for (const style of styles) {
    //check the style reference
    const errorReferences = await checkStyleReference(style, variableNames);
    //if there are errors, add to errors
    if (errorReferences.length > 0) {
      errors.push(...errorReferences);
    }
  }

  return errors;
}

// Check the variable reference
async function checkVariableReference(variable: Variable, variableNames: string[]) {
  const variableValues = variable.valuesByMode;
  const variableName = getOriginalVariableName(variable);
  const errorReferences = [];

  for (const modeId in variableValues) {
    //get the value by mode
    const value = variableValues[modeId];

    const errorReference = await checkReference(variableName, value, variableNames);

    if (errorReference) {
      errorReferences.push(errorReference);
    }
  }
  return errorReferences;
}

// Check the style reference
async function checkStyleReference(style: PaintStyle, variableNames: string[]) {
  const styleName = prepareVariableName(style.name);
  const errorReferences: string[] = [];

  //if the style has no bound variables or paints, return empty array
  if (!style?.boundVariables || !style?.boundVariables?.paints) {
    return errorReferences;
  }

  //check the paint references
  for (const paint of style.boundVariables.paints) {
    //check the paint reference
    const errorReference = await checkReference(styleName, paint, variableNames);
    //if there are errors, add to errors
    if (errorReference) {
      errorReferences.push(errorReference);
    }
  }

  //return the errors
  return errorReferences;
}

async function checkReference(
  variableName: string,
  reference: VariableValue,
  variableNames: string[]
) {
  //if the reference is not an object, return null
  if (
    !reference ||
    typeof reference !== 'object' ||
    !('type' in reference) ||
    !('id' in reference)
  ) {
    return null;
  }

  //if the reference is not a variable alias, return null
  if (reference.type !== 'VARIABLE_ALIAS') {
    return null;
  }

  //get the referenced variable
  const referencedVariable = await figma.variables.getVariableByIdAsync(reference.id);
  //if the referenced variable is not found, add to errors
  if (!referencedVariable) {
    return `${variableName} references an invalid variable id: ${reference.id}`;
  }

  //get the referenced variable name
  const referencedVariableName = getOriginalVariableName(referencedVariable);
  //if the referenced variable name is not in the variable names, add to errors
  if (!variableNames.includes(referencedVariableName)) {
    return `${variableName} references an invalid variable name: ${referencedVariableName}`;
  }

  return null;
}
