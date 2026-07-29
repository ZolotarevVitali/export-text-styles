// @vitest-environment happy-dom

import JSZip from 'jszip';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TPluginResponseMessage } from './messages';

const renderUi = (includeLogo = true): void => {
  document.body.innerHTML = `
    ${includeLogo ? '<img class="logo" alt="" />' : ''}
    <button id="export">Export</button>
    <select id="variable-mode">
      <option value="none">None</option>
      <option value="name" selected>Name</option>
      <option value="value">Value</option>
    </select>
    <div id="message"></div>
    <div id="error"></div>
    <div id="loading" aria-hidden="true"></div>
  `;
};

const createMessageEvent = (pluginMessage?: TPluginResponseMessage) => {
  return { data: pluginMessage ? { pluginMessage } : {} } as MessageEvent<{
    pluginMessage?: TPluginResponseMessage;
  }>;
};

const importUiModule = async () => {
  vi.resetModules();
  renderUi();
  vi.stubGlobal('parent', { postMessage: vi.fn() });

  return import('./ui');
};

beforeEach(() => {
  renderUi();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('UI controller', () => {
  it('bootstraps the runtime UI and sets the logo', async () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:runtime');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    await importUiModule();

    expect(document.querySelector<HTMLImageElement>('.logo')?.src).toContain('vzlogo');

    (document.getElementById('export') as HTMLButtonElement).click();
    const postMessage = vi.mocked(parent.postMessage);
    const exportMessage = postMessage.mock.calls[0][0] as {
      pluginMessage: { requestId: string };
    };
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          pluginMessage: {
            type: 'export-text-styles',
            requestId: exportMessage.pluginMessage.requestId,
            textStyles: { 'body.scss': 'content' },
          },
        },
      }),
    );

    await vi.waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
    });
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:runtime');
  });

  it('requires all runtime UI elements', async () => {
    const { createUiController } = await importUiModule();
    document.getElementById('loading')?.remove();

    expect(() =>
      createUiController({
        createZip: () => new JSZip(),
        document,
        logoUrl: 'logo.png',
        now: () => 1,
        parentWindow: { postMessage: vi.fn() },
        random: () => 0.5,
        url: URL,
        window,
      }),
    ).toThrow('Required UI element "#loading" was not found.');
  });

  it('supports an absent optional logo', async () => {
    const { createUiController } = await importUiModule();
    renderUi(false);

    expect(() =>
      createUiController({
        createZip: () => new JSZip(),
        document,
        logoUrl: 'logo.png',
        now: () => 1,
        parentWindow: { postMessage: vi.fn() },
        random: () => 0.5,
        url: URL,
        window,
      }),
    ).not.toThrow();
  });

  it('posts mode changes and resets invalid selections to the default', async () => {
    const { createUiController } = await importUiModule();
    renderUi();
    const postMessage = vi.fn();
    const controller = createUiController({
      createZip: () => new JSZip(),
      document,
      logoUrl: 'logo.png',
      now: () => 1,
      parentWindow: { postMessage },
      random: () => 0.5,
      url: URL,
      window,
    });
    const select = document.getElementById('variable-mode') as HTMLSelectElement;

    select.value = 'value';
    controller.handleVariableModeChange();
    expect(postMessage).toHaveBeenLastCalledWith(
      { pluginMessage: { type: 'save-variable-mode', variableMode: 'value' } },
      '*',
    );

    select.innerHTML += '<option value="invalid">Invalid</option>';
    select.value = 'invalid';
    expect(controller.getSelectedVariableMode()).toBe('name');
    expect(select.value).toBe('name');
  });

  it('starts one export request and applies the busy state', async () => {
    const { createUiController } = await importUiModule();
    renderUi();
    const postMessage = vi.fn();
    const controller = createUiController({
      createZip: () => new JSZip(),
      document,
      logoUrl: 'logo.png',
      now: () => 123,
      parentWindow: { postMessage },
      random: () => 0.5,
      url: URL,
      window,
    });
    const error = document.getElementById('error') as HTMLDivElement;
    const message = document.getElementById('message') as HTMLDivElement;
    error.textContent = 'old error';
    message.textContent = 'old message';

    controller.handleExport();
    controller.handleExport();

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      {
        pluginMessage: {
          type: 'export',
          requestId: `123-${(0.5).toString(36).slice(2)}`,
          variableMode: 'name',
        },
      },
      '*',
    );
    expect(error.textContent).toBe('');
    expect(message.textContent).toBe('');
    expect((document.getElementById('export') as HTMLButtonElement).disabled).toBe(true);
    expect(document.getElementById('loading')?.classList.contains('active')).toBe(true);
    expect(document.getElementById('loading')?.getAttribute('aria-hidden')).toBe('false');
  });

  it('handles mode, missing, stale, error, and empty response messages', async () => {
    const { createUiController } = await importUiModule();
    renderUi();
    const controller = createUiController({
      createZip: () => new JSZip(),
      document,
      logoUrl: 'logo.png',
      now: () => 1,
      parentWindow: { postMessage: vi.fn() },
      random: () => 0.5,
      url: URL,
      window,
    });

    await controller.handlePluginMessage(createMessageEvent());
    await controller.handlePluginMessage(
      createMessageEvent({ type: 'variable-mode', variableMode: 'none' }),
    );
    expect((document.getElementById('variable-mode') as HTMLSelectElement).value).toBe('none');

    controller.handleExport();
    await controller.handlePluginMessage(
      createMessageEvent({
        type: 'export-text-styles-error',
        requestId: 'stale',
        error: 'ignored',
      }),
    );
    expect(document.getElementById('error')?.textContent).toBe('');

    const requestId = `1-${(0.5).toString(36).slice(2)}`;
    await controller.handlePluginMessage(
      createMessageEvent({
        type: 'export-text-styles-error',
        requestId,
        error: 'Figma failed',
      }),
    );
    expect(document.getElementById('error')?.textContent).toBe('Export failed: Figma failed');
    expect((document.getElementById('export') as HTMLButtonElement).disabled).toBe(false);

    controller.handleExport();
    await controller.handlePluginMessage(
      createMessageEvent({ type: 'export-text-styles', requestId, textStyles: null }),
    );
    expect(document.getElementById('error')?.textContent).toBe('No text styles found');
    expect(document.getElementById('loading')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('creates and downloads a ZIP archive for a successful response', async () => {
    const { createUiController } = await importUiModule();
    renderUi();
    const createObjectURL = vi.fn(() => 'blob:download');
    const revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const controller = createUiController({
      createZip: () => new JSZip(),
      document,
      logoUrl: 'logo.png',
      now: () => 1,
      parentWindow: { postMessage: vi.fn() },
      random: () => 0.5,
      url: { createObjectURL, revokeObjectURL },
      window,
    });
    controller.handleExport();
    const requestId = `1-${(0.5).toString(36).slice(2)}`;

    await controller.handlePluginMessage(
      createMessageEvent({
        type: 'export-text-styles',
        requestId,
        textStyles: { 'body.scss': '@mixin body {}', 'index.scss': "@import './body';" },
      }),
    );

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:download');
    expect(document.querySelector('a')).toBeNull();
    expect(document.getElementById('message')?.textContent).toBe(
      'Text styles exported successfully',
    );
  });

  it.each([
    [new Error('zip failed'), 'Error downloading file: zip failed'],
    ['zip failed', 'Error downloading file: zip failed'],
  ])('reports ZIP generation failures', async (failure, expectedMessage) => {
    const { createUiController } = await importUiModule();
    renderUi();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const controller = createUiController({
      createZip: () => ({
        file: vi.fn(),
        generateAsync: vi.fn(async () => {
          throw failure;
        }),
      }),
      document,
      logoUrl: 'logo.png',
      now: () => 1,
      parentWindow: { postMessage: vi.fn() },
      random: () => 0.5,
      url: URL,
      window,
    });
    controller.handleExport();

    await controller.handlePluginMessage(
      createMessageEvent({
        type: 'export-text-styles',
        requestId: `1-${(0.5).toString(36).slice(2)}`,
        textStyles: { 'body.scss': 'content' },
      }),
    );

    expect(consoleError).toHaveBeenCalledWith('Error downloading text styles:', failure);
    expect(document.getElementById('error')?.textContent).toBe(expectedMessage);
  });
});
