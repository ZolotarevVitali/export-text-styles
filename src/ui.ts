import JSZip from 'jszip';
import logo from '../public/vzlogo.png';
import { TExportRequestMessage, TPluginResponseMessage } from './messages';

const getRequiredElement = <TElement extends HTMLElement>(id: string): TElement => {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Required UI element "#${id}" was not found.`);
  }

  return element as TElement;
};

const loadingDiv = getRequiredElement<HTMLDivElement>('loading');
const exportButton = getRequiredElement<HTMLButtonElement>('export');
const checkboxUseVariables =
  getRequiredElement<HTMLInputElement>('checkbox-use-variables');
const errorDiv = getRequiredElement<HTMLDivElement>('error');
const messageDiv = getRequiredElement<HTMLDivElement>('message');
const logoImage = document.querySelector<HTMLImageElement>('.logo');
let activeRequestId: string | null = null;

if (logoImage) {
  logoImage.src = logo;
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

const handleExport = (): void => {
  if (activeRequestId) {
    return;
  }

  errorDiv.textContent = '';
  messageDiv.textContent = '';
  activeRequestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  setBusy(true);

  const message: TExportRequestMessage = {
    type: 'export',
    requestId: activeRequestId,
    useVariables: checkboxUseVariables.checked,
  };

  parent.postMessage({ pluginMessage: message }, '*');
};

const downloadTextStyles = async (
  textStyles: NonNullable<
    Extract<TPluginResponseMessage, { type: 'export-text-styles' }>['textStyles']
  >,
): Promise<void> => {
  const zip = new JSZip();

  for (const [fileName, content] of Object.entries(textStyles)) {
    zip.file(fileName, content);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = 'text-styles.zip';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
};

const handlePluginMessage = async (
  event: MessageEvent<{ pluginMessage?: TPluginResponseMessage }>,
): Promise<void> => {
  const message = event.data?.pluginMessage;

  if (!message || message.requestId !== activeRequestId) {
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
window.addEventListener('message', handlePluginMessage);
