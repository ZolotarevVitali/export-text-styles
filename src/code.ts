import { exportJSONTokens } from './export/export-json';
import { exportCSSTokens } from './export/export-css';
import { validateTokens } from './validation';

// This plugin exports Figma design tokens (variables and styles) to JSON format

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 400 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === 'export-tokens') {
    const tokens = await exportJSONTokens();

    figma.ui.postMessage({
      type: 'export-files',
      tokens,
    });
  }

  if (msg.type === 'export-css') {
    const tokens = await exportCSSTokens();

    figma.ui.postMessage({
      type: 'export-files',
      tokens,
    });
  }

  if (msg.type === 'validate-tokens') {
    const validation = await validateTokens();

    figma.ui.postMessage({
      type: 'validation-result',
      validation,
    });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
