import { TTextStyleFiles } from './export/types';

export type TExportRequestMessage = {
  type: 'export';
  requestId: string;
  useVariables: boolean;
};

export type TExportSuccessMessage = {
  type: 'export-text-styles';
  requestId: string;
  textStyles: TTextStyleFiles | null;
};

export type TExportErrorMessage = {
  type: 'export-text-styles-error';
  requestId: string;
  error: string;
};

export type TPluginRequestMessage = TExportRequestMessage;
export type TPluginResponseMessage = TExportSuccessMessage | TExportErrorMessage;
