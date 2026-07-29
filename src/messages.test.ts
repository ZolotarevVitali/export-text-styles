import { describe, expect, it } from 'vitest';
import { DEFAULT_VARIABLE_MODE, isVariableMode, VARIABLE_MODES } from './messages';

describe('plugin message values', () => {
  it('recognizes every supported variable mode', () => {
    expect(VARIABLE_MODES).toEqual(['none', 'name', 'value']);
    expect(VARIABLE_MODES.every(isVariableMode)).toBe(true);
    expect(DEFAULT_VARIABLE_MODE).toBe('name');
  });

  it.each(['invalid', '', null, undefined, 1, {}])('rejects unsupported mode %j', (value) => {
    expect(isVariableMode(value)).toBe(false);
  });
});
