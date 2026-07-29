import { describe, expect, it } from 'vitest';
import {
  escapeScssComment,
  escapeScssString,
  getStableSuffix,
  normalizeScssIdentifier,
} from './scss';

describe('SCSS utilities', () => {
  it.each([
    ['Café / Déjà Vu', 'cafe-deja-vu'],
    ['---Heading___Title---', 'heading-title'],
    ['', 'unnamed'],
    ['🎨', 'unnamed'],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizeScssIdentifier(input)).toBe(expected);
  });

  it('creates deterministic suffixes that distinguish values', () => {
    expect(getStableSuffix('Heading/H1')).toBe(getStableSuffix('Heading/H1'));
    expect(getStableSuffix('Heading/H1')).not.toBe(getStableSuffix('Heading/H2'));
  });

  it('escapes SCSS strings and comments', () => {
    expect(escapeScssString('A\\B"\nC\r\nD')).toBe('A\\\\B\\"\\a C\\a D');
    expect(escapeScssComment('safe */ still safe')).toBe('safe * / still safe');
  });
});
