import { getStylesTokens } from '../utils/styles-tokens';
import { getVariablesTokens } from '../utils/variables-tokens';
async function exportJSONTokens() {
  const styles = await getStylesTokens({ filePath: 'styles/style.json' });
  const variables = await getVariablesTokens({ fileExtension: 'json' });

  const tokensCombined = {
    ...styles,
    ...variables,
  };

  //create a new object with the file path and the json tokens
  const JSONTokens: Record<string, string> = {};
  for (const key of Object.keys(tokensCombined)) {
    JSONTokens[key] = JSON.stringify(tokensCombined[key], null, 2);
  }

  return JSONTokens;
}

export { exportJSONTokens };
