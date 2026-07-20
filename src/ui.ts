import JSZip from 'jszip';
import logo from '../public/vzlogo.png';

// Make JSZip available globally for the UI
declare global {
  interface Window {
    JSZip: typeof JSZip;
  }
}

window.JSZip = JSZip;

const loadingDiv = document.getElementById('loading') as HTMLDivElement;

// Initialize
// Set the logo
const logoImg = document.querySelector('.logo') as HTMLImageElement;
if (logoImg) {
  logoImg.src = logo;
}

document.getElementById('export')!.onclick = () => {
  loadingDiv.classList.add('active');
  parent.postMessage({ pluginMessage: { type: 'export-tokens' } }, '*');
};

document.getElementById('export-css')!.onclick = () => {
  loadingDiv.classList.add('active');
  parent.postMessage({ pluginMessage: { type: 'export-css' } }, '*');
};

document.getElementById('cancel')!.onclick = () => {
  loadingDiv.classList.add('active');
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
};

document.getElementById('validate')!.onclick = () => {
  loadingDiv.classList.add('active');
  parent.postMessage({ pluginMessage: { type: 'validate-tokens' } }, '*');
};

const errorDiv = document.getElementById('error') as HTMLDivElement;
const divMessage = document.getElementById('message') as HTMLDivElement;

// Handle the export message from the plugin
window.onmessage = async (event) => {
  errorDiv.textContent = '';
  divMessage.textContent = '';
  const msg = event.data.pluginMessage;
  loadingDiv.classList.remove('active');
  if (msg && msg.type === 'export-files') {
    if (!msg.tokens) {
      console.error('No tokens to download');
      return;
    }
    try {
      const zip = new JSZip();

      for (const token of Object.keys(msg.tokens)) {
        zip.file(token, msg.tokens[token]);
      }

      const content = await zip.generateAsync({ type: 'base64' });

      // Create a download link
      const a = document.createElement('a');
      a.href = 'data:application/zip;base64,' + content;
      a.download = 'tokens.zip';

      // Trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up
      URL.revokeObjectURL(a.href);
    } catch (error: unknown) {
      console.error('Error handling file download:', error);
      // Show error to user

      errorDiv.textContent =
        'Error downloading file: ' + (error instanceof Error ? error.message : String(error));
    }
  }

  if (msg && msg.type === 'validation-result') {
    if (msg.validation.success) {
      divMessage.textContent = msg.validation.message;
    } else {
      console.error('Validation completed with errors');
      const errorDiv = document.getElementById('error') as HTMLDivElement;
      errorDiv.textContent = msg.validation.message;
      const blob = new Blob([msg.validation.fileContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'validation.txt';

      // Trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
};
