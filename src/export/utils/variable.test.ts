import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getVariableName,
  getVariableNameById,
  getVariableValueById,
  prepareVariableName,
} from './variable';

type TMockVariable = {
  id: string;
  name: string;
  variableCollectionId: string;
  valuesByMode: Record<string, VariableValue>;
};

const stubVariables = (
  variables: Record<string, TMockVariable>,
  collections: Record<string, { defaultModeId: string }>,
): void => {
  vi.stubGlobal('figma', {
    variables: {
      getVariableByIdAsync: vi.fn(async (id: string) => variables[id] ?? null),
      getVariableCollectionByIdAsync: vi.fn(async (id: string) => collections[id] ?? null),
    },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Figma variable utilities', () => {
  it('normalizes variable names and returns CSS references', async () => {
    const variable = {
      id: 'family',
      name: 'Typography/Font.Family Name',
      variableCollectionId: 'collection',
      valuesByMode: { default: 'Inter' },
    };
    stubVariables({ family: variable }, { collection: { defaultModeId: 'default' } });

    expect(prepareVariableName(variable.name)).toBe('typography-font-family-name');
    expect(getVariableName(variable as unknown as Variable)).toBe('typography-font-family-name');
    await expect(getVariableNameById('family')).resolves.toBe(
      'var(--typography-font-family-name)',
    );
  });

  it('returns null for absent IDs and missing variables', async () => {
    stubVariables({}, {});

    await expect(getVariableNameById()).resolves.toBeNull();
    await expect(getVariableNameById('missing')).resolves.toBeNull();
    await expect(getVariableValueById()).resolves.toBeNull();
    await expect(getVariableValueById('missing')).resolves.toBeNull();
  });

  it('returns null when a variable collection is missing', async () => {
    stubVariables(
      {
        value: {
          id: 'value',
          name: 'Value',
          variableCollectionId: 'missing',
          valuesByMode: { default: 12 },
        },
      },
      {},
    );

    await expect(getVariableValueById('value')).resolves.toBeNull();
  });

  it.each([
    ['string', 'Inter'],
    ['number', 12],
  ])('resolves a finite %s value', async (_type, value) => {
    stubVariables(
      {
        value: {
          id: 'value',
          name: 'Value',
          variableCollectionId: 'collection',
          valuesByMode: { default: value },
        },
      },
      { collection: { defaultModeId: 'default' } },
    );

    await expect(getVariableValueById('value')).resolves.toBe(value);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, true])(
    'rejects unsupported value %j',
    async (value) => {
      stubVariables(
        {
          value: {
            id: 'value',
            name: 'Value',
            variableCollectionId: 'collection',
            valuesByMode: { default: value as VariableValue },
          },
        },
        { collection: { defaultModeId: 'default' } },
      );

      await expect(getVariableValueById('value')).resolves.toBeNull();
    },
  );

  it('resolves aliases and rejects cycles', async () => {
    const collections = { collection: { defaultModeId: 'default' } };
    stubVariables(
      {
        alias: {
          id: 'alias',
          name: 'Alias',
          variableCollectionId: 'collection',
          valuesByMode: { default: { type: 'VARIABLE_ALIAS', id: 'value' } },
        },
        value: {
          id: 'value',
          name: 'Value',
          variableCollectionId: 'collection',
          valuesByMode: { default: 'resolved' },
        },
      },
      collections,
    );
    await expect(getVariableValueById('alias')).resolves.toBe('resolved');

    stubVariables(
      {
        first: {
          id: 'first',
          name: 'First',
          variableCollectionId: 'collection',
          valuesByMode: { default: { type: 'VARIABLE_ALIAS', id: 'second' } },
        },
        second: {
          id: 'second',
          name: 'Second',
          variableCollectionId: 'collection',
          valuesByMode: { default: { type: 'VARIABLE_ALIAS', id: 'first' } },
        },
      },
      collections,
    );
    await expect(getVariableValueById('first')).resolves.toBeNull();
  });
});
