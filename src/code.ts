import { exportTextStyles } from './export/export-text-styles';

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
figma.ui.onmessage = async (msg: { type: string; useVariables: boolean }) => {
  if (msg.type === 'export') {
    const textStyles = await exportTextStyles({ useVariables: msg.useVariables });

    figma.ui.postMessage({
      type: 'export-text-styles',
      textStyles,
    });
  }
};
