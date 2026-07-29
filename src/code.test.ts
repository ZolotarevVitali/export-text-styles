import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TPluginResponseMessage } from './messages';

const createDependencies = ({
  storedVariableMode = 'value',
}: {
  storedVariableMode?: unknown;
} = {}) => {
  const clientStorage = {
    getAsync: vi.fn(async () => storedVariableMode),
    setAsync: vi.fn(async () => undefined),
  };
  const ui = {
    onmessage: undefined as UIAPI['onmessage'],
    postMessage: vi.fn(),
  };

  return {
    clientStorage,
    handleExport: vi.fn(
      async (): Promise<TPluginResponseMessage> => ({
        type: 'export-text-styles',
        requestId: 'request-1',
        textStyles: { 'body.scss': 'content' },
      }),
    ),
    html: '<main>Plugin</main>',
    logError: vi.fn(),
    showUI: vi.fn(),
    ui,
  };
};

const importCodeModule = async () => {
  vi.resetModules();
  vi.stubGlobal('__html__', '<main>Plugin</main>');
  vi.stubGlobal('figma', {
    clientStorage: {
      getAsync: vi.fn(async () => 'name'),
      setAsync: vi.fn(async () => undefined),
    },
    showUI: vi.fn(),
    ui: {
      onmessage: null,
      postMessage: vi.fn(),
    },
  });

  return import('./code');
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('plugin sandbox controller', () => {
  it('initializes the plugin with the stored variable mode', async () => {
    const { createPluginController } = await importCodeModule();
    const dependencies = createDependencies();
    const controller = createPluginController(dependencies);

    await controller.initializePlugin();

    expect(dependencies.clientStorage.getAsync).toHaveBeenCalledWith('variable-mode');
    expect(dependencies.showUI).toHaveBeenCalledWith('<main>Plugin</main>', {
      width: 400,
      height: 400,
    });
    expect(dependencies.ui.onmessage).toBe(controller.handlePluginMessage);
    expect(dependencies.ui.postMessage).toHaveBeenCalledWith({
      type: 'variable-mode',
      variableMode: 'value',
    });
  });

  it('uses the default for invalid storage values and loading failures', async () => {
    const { createPluginController } = await importCodeModule();
    const invalidDependencies = createDependencies({ storedVariableMode: 'invalid' });
    const invalidController = createPluginController(invalidDependencies);
    const failingDependencies = createDependencies();
    const loadingError = new Error('storage unavailable');
    failingDependencies.clientStorage.getAsync.mockRejectedValueOnce(loadingError);
    const failingController = createPluginController(failingDependencies);

    await expect(invalidController.getStoredVariableMode()).resolves.toBe('name');
    await expect(failingController.getStoredVariableMode()).resolves.toBe('name');
    expect(failingDependencies.logError).toHaveBeenCalledWith(
      'Error loading variable mode:',
      loadingError,
    );
  });

  it('persists variable mode changes and reports persistence failures', async () => {
    const { createPluginController } = await importCodeModule();
    const dependencies = createDependencies();
    const controller = createPluginController(dependencies);

    await controller.handlePluginMessage({ type: 'save-variable-mode', variableMode: 'none' });
    expect(dependencies.clientStorage.setAsync).toHaveBeenCalledWith('variable-mode', 'none');

    const storageError = new Error('write failed');
    dependencies.clientStorage.setAsync.mockRejectedValueOnce(storageError);
    await controller.handlePluginMessage({ type: 'save-variable-mode', variableMode: 'value' });
    expect(dependencies.logError).toHaveBeenCalledWith(
      'Error saving variable mode:',
      storageError,
    );
  });

  it('routes successful and failed export responses to the UI', async () => {
    const { createPluginController } = await importCodeModule();
    const dependencies = createDependencies();
    const controller = createPluginController(dependencies);
    const request = { type: 'export', requestId: 'request-1', variableMode: 'none' } as const;

    await controller.handlePluginMessage(request);
    expect(dependencies.handleExport).toHaveBeenCalledWith(request);
    expect(dependencies.ui.postMessage).toHaveBeenLastCalledWith({
      type: 'export-text-styles',
      requestId: 'request-1',
      textStyles: { 'body.scss': 'content' },
    });

    dependencies.handleExport.mockResolvedValueOnce({
      type: 'export-text-styles-error',
      requestId: 'request-1',
      error: 'failed',
    });
    await controller.handlePluginMessage(request);
    expect(dependencies.logError).toHaveBeenCalledWith(
      'Error exporting text styles:',
      'failed',
    );
  });

  it('ignores unsupported messages', async () => {
    const { createPluginController } = await importCodeModule();
    const dependencies = createDependencies();
    const controller = createPluginController(dependencies);

    await controller.handlePluginMessage({ type: 'unsupported' } as never);

    expect(dependencies.handleExport).not.toHaveBeenCalled();
    expect(dependencies.ui.postMessage).not.toHaveBeenCalled();
  });
});
