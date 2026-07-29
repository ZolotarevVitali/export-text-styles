/** Resolves a Figma variable ID to a CSS custom-property reference. */
export async function getVariableNameById(id?: string): Promise<string | null> {
  if (!id) {
    return null;
  }

  const variable = await figma.variables.getVariableByIdAsync(id);
  if (variable) {
    return `var(--${getVariableName(variable)})`;
  }
  return null;
}

/** Resolves a variable and its aliases using each collection's default mode. */
export async function getVariableValueById(id?: string): Promise<string | number | null> {
  if (!id) {
    return null;
  }

  return resolveVariableValue(id, new Set());
}

const resolveVariableValue = async (
  id: string,
  visitedVariableIds: Set<string>,
): Promise<string | number | null> => {
  if (visitedVariableIds.has(id)) {
    return null;
  }

  visitedVariableIds.add(id);

  const variable = await figma.variables.getVariableByIdAsync(id);

  if (!variable) {
    return null;
  }

  const collection = await figma.variables.getVariableCollectionByIdAsync(
    variable.variableCollectionId,
  );

  if (!collection) {
    return null;
  }

  const value = variable.valuesByMode[collection.defaultModeId];

  if (isVariableAlias(value)) {
    return resolveVariableValue(value.id, visitedVariableIds);
  }

  if (typeof value === 'string') {
    return value;
  }

  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const isVariableAlias = (value: VariableValue | undefined): value is VariableAlias => {
  return typeof value === 'object' && value !== null && 'type' in value
    ? value.type === 'VARIABLE_ALIAS'
    : false;
};

/** Converts a Figma variable name into a CSS custom-property name. */
export function getVariableName(variable: Variable) {
  return prepareVariableName(variable.name);
}

/** Normalizes Figma path and word separators for use in CSS identifiers. */
export function prepareVariableName(name: string) {
  return name.toLowerCase().replace(/[/. ]/g, '-');
}
