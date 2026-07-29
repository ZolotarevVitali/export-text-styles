import { TTextStyleFiles } from './export/types';

export const VARIABLE_MODES = ['none', 'name', 'value'] as const;

export type TVariableMode = (typeof VARIABLE_MODES)[number];

export const DEFAULT_VARIABLE_MODE: TVariableMode = 'name';

export const isVariableMode = (value: unknown): value is TVariableMode => {
  return VARIABLE_MODES.some((variableMode) => variableMode === value);
};

export type TExportRequestMessage = {
  type: 'export';
  requestId: string;
  variableMode: TVariableMode;
};

export type TSaveVariableModeMessage = {
  type: 'save-variable-mode';
  variableMode: TVariableMode;
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

export type TVariableModeMessage = {
  type: 'variable-mode';
  variableMode: TVariableMode;
};

export type TPluginRequestMessage = TExportRequestMessage | TSaveVariableModeMessage;
export type TPluginResponseMessage =
  | TExportSuccessMessage
  | TExportErrorMessage
  | TVariableModeMessage;
