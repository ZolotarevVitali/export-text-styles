import { handleExportRequest } from './export-request';
import { TPluginRequestMessage } from './messages';

figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (message: TPluginRequestMessage) => {
  if (message.type !== 'export') {
    return;
  }

  const response = await handleExportRequest(message);

  if (response.type === 'export-text-styles-error') {
    console.error('Error exporting text styles:', response.error);
  }

  figma.ui.postMessage(response);
};
