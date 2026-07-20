export function getOriginalVariableName(variable: Variable) {
  return variable.name.replace(/\//g, '-');
}

export function getOriginalStyleName(style: PaintStyle) {
  return style.name.replace(/\//g, '-');
}

//prepare the variable name for the token key
export function getVariableName(variable: Variable) {
  return prepareVariableName(variable.name);
}

export function prepareVariableName(name: string) {
  return name.toLowerCase().replace(/[/. ]/g, '-');
}
