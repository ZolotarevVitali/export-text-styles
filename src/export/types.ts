import { IColorToken, IVariableToken } from './interfaces';

export type TTokenValues = IColorToken | IVariableToken;
export type TTokenValue = TTokenValues & { mode?: string };
export type TTokenGroup = Record<string, TTokenValue>;
export type TTokens = Record<string, TTokenValue>;
export type TVariables = Record<string, TTokenValue>;
export type TToken = { path: string; tokens: TTokenGroup };
