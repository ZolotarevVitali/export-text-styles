import { TTokens } from '../types';
import { getStylesTokens } from '../utils/styles-tokens';
import { getVariablesTokens } from '../utils/variables-tokens';
import { BREAKPOINTS_SORT_ORDER } from '../../constants';

async function exportCSSTokens() {
  const styleTokens = await getStylesTokens({ filePath: 'styles/style.scss' });
  const variablesTokens = await getVariablesTokens({ fileExtension: 'scss' });

  const tokensCombined = {
    ...styleTokens,
    ...variablesTokens,
  };

  //create a new object with the file path and the css tokens
  const CSSTokens: Record<string, string> = {};
  for (const key of Object.keys(tokensCombined)) {
    CSSTokens[key] = getCSSTokensFileContent(tokensCombined[key]);
  }

  return { ...CSSTokens, 'index.scss': getIndexFileContent(tokensCombined) };
}

function getIndexFileContent(tokens: Record<string, TTokens>): string {
  let fileContent = '';
  for (const key of Object.keys(tokens)) {
    fileContent += `@import './${key.replace('.scss', '')}';\n`;
  }
  return fileContent;
}

function getCSSTokensFileContent(token: TTokens): string {
  const cssTokensString = getCSSTokensString(token);
  const modeName = getCSSTokenModeString(token);
  const additionalImports = getAdditionalImportsString(token);
  const fileContent = `${additionalImports}:root${modeName} {\n${cssTokensString}\n}`;
  return fileContent;
}

function getCSSTokensString(token: TTokens): string {
  const sortedToken = getSortedTokens(token);

  const cssTokensString = sortedToken
    .map((key) => getCSSTokensStringItem(key, token[key].value))
    .join('\n');
  return cssTokensString;
}

function getSortedTokens(tokens: TTokens): string[] {
  return Object.keys(tokens).sort((a, b) => {
    const aBreakpoint = replaceBreakpointByValue(a);
    const bBreakpoint = replaceBreakpointByValue(b);

    return aBreakpoint.localeCompare(bBreakpoint);
  });
}

function replaceBreakpointByValue(name: string): string {
  let replacedName = name;

  for (const breakpoint of Object.keys(BREAKPOINTS_SORT_ORDER)) {
    replacedName = replacedName.replace(breakpoint, BREAKPOINTS_SORT_ORDER[breakpoint].toString());
  }

  return replacedName;
}

//get the css token string item
function getCSSTokensStringItem(key: string, value: string): string {
  const reBreakpoints = /-\[[\w-]+\]$/;
  //get the breakpoint name from the key
  const breakpointName = key.match(reBreakpoints)?.[0]?.replace(/(-\[|\])/g, '') ?? '';
  //get the variable name from the key
  const variableName = key.replace(reBreakpoints, '');
  //get the css token string
  const cssTokenString = `\t--${variableName}: ${getCSSTokenValueString(value)};`;
  //if there is a breakpoint, return the css token string with the breakpoint
  if (breakpointName) {
    return `\t@media (min-width: $${breakpointName}) {\n\t${cssTokenString}\n\t}`;
  }
  //if there is no breakpoint, return the css token string
  return cssTokenString;
}

function getCSSTokenValueString(tokenValue: string | boolean): string | boolean {
  if (typeof tokenValue !== 'string') {
    return tokenValue;
  }
  return tokenValue.replace(/\{([\w\s-]+)(-\[[\w\s-]+\])?\}/g, 'var(--$1)');
}

//get the css token mode string
function getCSSTokenModeString(token: TTokens): string {
  const modeName = Object.values(token)[0]?.mode;
  return modeName ? `[data-theme='${modeName}']` : '';
}

function getAdditionalImportsString(token: TTokens): string {
  const reBreakpoints = /\[[\w-]+\]$/;
  const isThereBreakpoints = Object.keys(token).some((key) => reBreakpoints.test(key));
  return isThereBreakpoints ? "@import '~styles/variables/breakpoints';\n\n" : '';
}

export { exportCSSTokens };
