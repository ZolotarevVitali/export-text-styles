export type TFigmaTextStyle = {
  id: string;
  name: string;
  fontSize: number;
  fontName: {
    family: string;
    style: string;
  };
  textDecoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  letterSpacing: {
    value: number;
    unit: 'PIXELS' | 'PERCENT';
  };
  lineHeight:
    | {
        value: number;
        unit: 'PIXELS' | 'PERCENT';
      }
    | {
        unit: 'AUTO';
      };
  paragraphIndent: number;
  textCase: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
  boundVariables?: {
    fontFamily?: {
      id: string;
    };
    fontWeight?: {
      id: string;
    };
    fontStyle?: {
      id: string;
    };
    letterSpacing?: {
      id: string;
    };
    lineHeight?: {
      id: string;
    };
    paragraphIndent?: {
      id: string;
    };
  };
};

export type TPreparedTextStyle = {
  mixinName: string;
  originalName: string;
  'font-size': string | null;
  'font-family': string | null;
  'font-weight': string | null;
  'line-height': string | null;
  'letter-spacing': string | null;
  'font-style': string | null;
  'text-transform': string | null;
  'text-decoration': string | null;
  'text-indent': string | null;
};

export type TTextStyleFiles = Record<string, string>;
