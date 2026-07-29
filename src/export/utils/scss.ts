/** Converts arbitrary text into a readable SCSS-safe identifier segment. */
export const normalizeScssIdentifier = (value: string): string => {
  const normalizedValue = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');

  return normalizedValue || 'unnamed';
};

/** Creates a stable suffix without relying on browser or Node crypto APIs. */
export const getStableSuffix = (value: string): string => {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
};

/** Escapes a value for use inside a double-quoted SCSS string. */
export const escapeScssString = (value: string): string => {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\a ');
};

/** Prevents user-controlled text from terminating an SCSS block comment. */
export const escapeScssComment = (value: string): string => {
  return value.replace(/\*\//g, '* /');
};
