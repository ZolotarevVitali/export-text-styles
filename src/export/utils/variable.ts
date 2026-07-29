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

/** Converts a Figma variable name into a CSS custom-property name. */
export function getVariableName(variable: Variable) {
  return prepareVariableName(variable.name);
}

/** Normalizes Figma path and word separators for use in CSS identifiers. */
export function prepareVariableName(name: string) {
  return name.toLowerCase().replace(/[/. ]/g, '-');
}
