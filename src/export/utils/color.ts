// Helper function to convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

export function rgbaToHex({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string | null {
  if (typeof a !== 'number') return null;

  if (a !== 1) {
    const alpha = a === 0 ? 0 : a.toFixed(2);

    return `rgba(${[r, g, b].map((n) => Math.round(n * 255)).join(', ')}, ${alpha})`;
  }

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}`;
}

export function toHex(value: number): string {
  const hex = Math.round(value * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
