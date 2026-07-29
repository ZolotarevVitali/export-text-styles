import { handleExportRequest } from './export-request';
import {
  DEFAULT_VARIABLE_MODE,
  isVariableMode,
  TPluginRequestMessage,
  TVariableMode,
} from './messages';

const VARIABLE_MODE_STORAGE_KEY = 'variable-mode';

const getStoredVariableMode = async (): Promise<TVariableMode> => {
  try {
    const storedVariableMode: unknown = await figma.clientStorage.getAsync(
      VARIABLE_MODE_STORAGE_KEY,
    );

    return isVariableMode(storedVariableMode) ? storedVariableMode : DEFAULT_VARIABLE_MODE;
  } catch (error: unknown) {
    console.error('Error loading variable mode:', error);
    return DEFAULT_VARIABLE_MODE;
  }
};

const handlePluginMessage = async (message: TPluginRequestMessage): Promise<void> => {
  if (message.type === 'save-variable-mode') {
    try {
      await figma.clientStorage.setAsync(VARIABLE_MODE_STORAGE_KEY, message.variableMode);
    } catch (error: unknown) {
      console.error('Error saving variable mode:', error);
    }
    return;
  }

  if (message.type !== 'export') {
    return;
  }

  const response = await handleExportRequest(message);

  if (response.type === 'export-text-styles-error') {
    console.error('Error exporting text styles:', response.error);
  }

  figma.ui.postMessage(response);
};

const initializePlugin = async (): Promise<void> => {
  const variableMode = await getStoredVariableMode();

  figma.showUI(__html__, { width: 400, height: 400 });
  figma.ui.onmessage = handlePluginMessage;
  figma.ui.postMessage({ type: 'variable-mode', variableMode });
};

void initializePlugin();
