import { handleExportRequest } from './export-request';
import {
  DEFAULT_VARIABLE_MODE,
  isVariableMode,
  TPluginRequestMessage,
  TVariableMode,
} from './messages';

const VARIABLE_MODE_STORAGE_KEY = 'variable-mode';

type TPluginDependencies = {
  clientStorage: Pick<ClientStorageAPI, 'getAsync' | 'setAsync'>;
  handleExport: typeof handleExportRequest;
  html: string;
  logError: typeof console.error;
  showUI: typeof figma.showUI;
  ui: Pick<UIAPI, 'onmessage' | 'postMessage'>;
};

export const createPluginController = ({
  clientStorage,
  handleExport,
  html,
  logError,
  showUI,
  ui,
}: TPluginDependencies) => {
  const getStoredVariableMode = async (): Promise<TVariableMode> => {
    try {
      const storedVariableMode: unknown = await clientStorage.getAsync(VARIABLE_MODE_STORAGE_KEY);

      return isVariableMode(storedVariableMode) ? storedVariableMode : DEFAULT_VARIABLE_MODE;
    } catch (error: unknown) {
      logError('Error loading variable mode:', error);
      return DEFAULT_VARIABLE_MODE;
    }
  };

  const handlePluginMessage = async (message: TPluginRequestMessage): Promise<void> => {
    if (message.type === 'save-variable-mode') {
      try {
        await clientStorage.setAsync(VARIABLE_MODE_STORAGE_KEY, message.variableMode);
      } catch (error: unknown) {
        logError('Error saving variable mode:', error);
      }
      return;
    }

    if (message.type !== 'export') {
      return;
    }

    const response = await handleExport(message);

    if (response.type === 'export-text-styles-error') {
      logError('Error exporting text styles:', response.error);
    }

    ui.postMessage(response);
  };

  const initializePlugin = async (): Promise<void> => {
    const variableMode = await getStoredVariableMode();

    showUI(html, { width: 400, height: 400 });
    ui.onmessage = handlePluginMessage;
    ui.postMessage({ type: 'variable-mode', variableMode });
  };

  return { getStoredVariableMode, handlePluginMessage, initializePlugin };
};

const pluginController = createPluginController({
  clientStorage: figma.clientStorage,
  handleExport: handleExportRequest,
  html: __html__,
  logError: console.error,
  showUI: figma.showUI,
  ui: figma.ui,
});

void pluginController.initializePlugin();
