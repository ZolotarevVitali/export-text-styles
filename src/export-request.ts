import { exportTextStyles } from './export/export-text-styles';
import { TExportRequestMessage, TPluginResponseMessage } from './messages';

type TExportTextStyles = typeof exportTextStyles;

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

export const handleExportRequest = async (
  message: TExportRequestMessage,
  handleExportTextStyles: TExportTextStyles = exportTextStyles,
): Promise<TPluginResponseMessage> => {
  try {
    const textStyles = await handleExportTextStyles({ useVariables: message.useVariables });

    return {
      type: 'export-text-styles',
      requestId: message.requestId,
      textStyles,
    };
  } catch (error: unknown) {
    return {
      type: 'export-text-styles-error',
      requestId: message.requestId,
      error: getErrorMessage(error),
    };
  }
};
