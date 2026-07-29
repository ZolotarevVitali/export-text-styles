import JSZip from 'jszip';
import logo from '../public/vzlogo.png';
import {
  DEFAULT_VARIABLE_MODE,
  isVariableMode,
  TExportRequestMessage,
  TPluginResponseMessage,
  TSaveVariableModeMessage,
  TVariableMode,
} from './messages';

type TZip = Pick<JSZip, 'file' | 'generateAsync'>;

type TUiDependencies = {
  createZip: () => TZip;
  document: Document;
  logoUrl: string;
  now: () => number;
  parentWindow: { postMessage: (message: unknown, targetOrigin: string) => void };
  random: () => number;
  url: Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;
  window: Window;
};

export const createUiController = ({
  createZip,
  document: uiDocument,
  logoUrl,
  now,
  parentWindow,
  random,
  url,
  window: uiWindow,
}: TUiDependencies) => {
  const getRequiredElement = <TElement extends HTMLElement>(id: string): TElement => {
    const element = uiDocument.getElementById(id);

    if (!element) {
      throw new Error(`Required UI element "#${id}" was not found.`);
    }

    return element as TElement;
  };

  const loadingDiv = getRequiredElement<HTMLDivElement>('loading');
  const exportButton = getRequiredElement<HTMLButtonElement>('export');
  const variableModeSelect = getRequiredElement<HTMLSelectElement>('variable-mode');
  const errorDiv = getRequiredElement<HTMLDivElement>('error');
  const messageDiv = getRequiredElement<HTMLDivElement>('message');
  const logoImage = uiDocument.querySelector<HTMLImageElement>('.logo');
  let activeRequestId: string | null = null;

  if (logoImage) {
    logoImage.src = logoUrl;
  }

  const setBusy = (isBusy: boolean): void => {
    exportButton.disabled = isBusy;
    exportButton.setAttribute('aria-busy', String(isBusy));
    loadingDiv.classList.toggle('active', isBusy);
    loadingDiv.setAttribute('aria-hidden', String(!isBusy));
  };

  const finishRequest = (): void => {
    activeRequestId = null;
    setBusy(false);
  };

  const getSelectedVariableMode = (): TVariableMode => {
    if (isVariableMode(variableModeSelect.value)) {
      return variableModeSelect.value;
    }

    variableModeSelect.value = DEFAULT_VARIABLE_MODE;
    return DEFAULT_VARIABLE_MODE;
  };

  const handleVariableModeChange = (): void => {
    const message: TSaveVariableModeMessage = {
      type: 'save-variable-mode',
      variableMode: getSelectedVariableMode(),
    };

    parentWindow.postMessage({ pluginMessage: message }, '*');
  };

  const handleExport = (): void => {
    if (activeRequestId) {
      return;
    }

    errorDiv.textContent = '';
    messageDiv.textContent = '';
    activeRequestId = `${now()}-${random().toString(36).slice(2)}`;
    setBusy(true);

    const message: TExportRequestMessage = {
      type: 'export',
      requestId: activeRequestId,
      variableMode: getSelectedVariableMode(),
    };

    parentWindow.postMessage({ pluginMessage: message }, '*');
  };

  const downloadTextStyles = async (
    textStyles: NonNullable<
      Extract<TPluginResponseMessage, { type: 'export-text-styles' }>['textStyles']
    >,
  ): Promise<void> => {
    const zip = createZip();

    for (const [fileName, content] of Object.entries(textStyles)) {
      zip.file(fileName, content);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = url.createObjectURL(zipBlob);
    const downloadLink = uiDocument.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = 'text-styles.zip';
    uiDocument.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    url.revokeObjectURL(downloadUrl);
  };

  const handlePluginMessage = async (
    event: MessageEvent<{ pluginMessage?: TPluginResponseMessage }>,
  ): Promise<void> => {
    const message = event.data?.pluginMessage;

    if (!message) {
      return;
    }

    if (message.type === 'variable-mode') {
      variableModeSelect.value = message.variableMode;
      return;
    }

    if (message.requestId !== activeRequestId) {
      return;
    }

    if (message.type === 'export-text-styles-error') {
      errorDiv.textContent = `Export failed: ${message.error}`;
      finishRequest();
      return;
    }

    if (!message.textStyles) {
      errorDiv.textContent = 'No text styles found';
      finishRequest();
      return;
    }

    try {
      await downloadTextStyles(message.textStyles);
      messageDiv.textContent = 'Text styles exported successfully';
    } catch (error: unknown) {
      console.error('Error downloading text styles:', error);
      errorDiv.textContent =
        'Error downloading file: ' + (error instanceof Error ? error.message : String(error));
    } finally {
      finishRequest();
    }
  };

  exportButton.addEventListener('click', handleExport);
  variableModeSelect.addEventListener('change', handleVariableModeChange);
  uiWindow.addEventListener('message', handlePluginMessage);

  return {
    downloadTextStyles,
    getSelectedVariableMode,
    handleExport,
    handlePluginMessage,
    handleVariableModeChange,
  };
};

createUiController({
  createZip: () => new JSZip(),
  document,
  logoUrl: logo,
  now: Date.now,
  parentWindow: parent,
  random: Math.random,
  url: URL,
  window,
});
