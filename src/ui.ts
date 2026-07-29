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

const checkboxUseVariables = document.getElementById('checkbox-use-variables') as HTMLInputElement;

document.getElementById('export')!.onclick = () => {
  loadingDiv.classList.add('active');
  const useVariables = checkboxUseVariables.checked;
  parent.postMessage({ pluginMessage: { type: 'export', useVariables } }, '*');
};

const errorDiv = document.getElementById('error') as HTMLDivElement;
const divMessage = document.getElementById('message') as HTMLDivElement;

// Handle the export message from the plugin
window.onmessage = async (event) => {
  errorDiv.textContent = '';
  divMessage.textContent = '';
  const msg = event.data.pluginMessage;
  loadingDiv.classList.remove('active');
  if (msg && msg.type === 'export-text-styles') {
    if (!msg.textStyles) {
      errorDiv.textContent = 'No text styles found';
      return;
    }
    try {
      const zip = new JSZip();

      for (const token of Object.keys(msg.textStyles)) {
        zip.file(token, msg.textStyles[token]);
      }

      const content = await zip.generateAsync({ type: 'base64' });

      // Create a download link
      const a = document.createElement('a');
      a.href = 'data:application/zip;base64,' + content;
      a.download = 'text-styles.zip';

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
};
