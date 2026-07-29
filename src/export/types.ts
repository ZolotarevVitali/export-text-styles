export type TFigmaTextStyle = {
  name: string;
  fontSize: number;
  fontName: {
    family: string;
    style: string;
  };
  boundVariables?: {
    fontFamily?: {
      id: string;
    };
    fontWeight?: {
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
};
