// Define types for our tokens
export interface IColorToken {
  value: string;
  type: "color";
}

export interface IShadowValue {
  color: string;
  type: "dropShadow";
  x: number;
  y: number;
  blur: number;
  spread: number;
}

export interface IShadowToken {
  value: IShadowValue;
  type: "boxShadow";
}


export interface IVariableToken {
  value: string;
  type: "variable";
}