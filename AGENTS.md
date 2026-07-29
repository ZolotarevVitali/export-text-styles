# AI Agent Guide

Use this file as the primary repository guide when implementing features, fixing
bugs, or reviewing changes.

## Project purpose

This repository contains a Figma plugin that exports local text styles as SCSS
mixins. The plugin:

1. Reads local text styles from the current Figma file.
2. Converts supported typography properties to SCSS.
3. Groups mixins into files by the first segment of each Figma style name.
4. Adds an `index.scss` file that imports every generated style file.
5. Downloads the generated files as `text-styles.zip`.

The current plugin is a text-style exporter. Old references to general design
tokens, JSON export, CSS export, or validation describe removed functionality
and must not be treated as current behavior.

## Technology and runtime model

- TypeScript with strict type checking
- Figma Plugin API
- Imperative HTML/DOM UI; this project does not use React
- Webpack and `ts-loader`
- JSZip for creating the downloadable archive
- ESLint with TypeScript and Figma plugin rules

Figma plugins run in two separate environments:

- **Plugin sandbox:** `src/code.ts` has access to the `figma` API, but not browser
  DOM APIs.
- **UI iframe:** `src/ui.ts` and `ui.html` have access to browser APIs, but not
  direct access to the `figma` API.

Keep Figma document access in the sandbox and browser/download behavior in the
UI. Communicate between them with plugin messages.

## Runtime data flow

The current message and export flow is:

```text
Export button click in src/ui.ts
  -> parent.postMessage({ pluginMessage: { type: 'export', useVariables } })
  -> figma.ui.onmessage in src/code.ts
  -> exportTextStyles({ useVariables })
  -> getTextStyles({ useVariables })
  -> figma.getLocalTextStylesAsync()
  -> prepare and group styles
  -> build Record<fileName, scssContent> plus index.scss
  -> figma.ui.postMessage({
       type: 'export-text-styles',
       textStyles
     })
  -> window.onmessage in src/ui.ts
  -> JSZip generates text-styles.zip
  -> browser download is triggered
```

If no local text styles exist, `exportTextStyles` returns `null` and the UI
shows `No text styles found`.

When changing this protocol, update both sender and receiver together and keep
the message type strings synchronized.

## Source map

- `manifest.json` — Figma plugin metadata and runtime entry points.
- `ui.html` — UI markup and styles used as the Webpack HTML template.
- `public/vzlogo.png` — logo imported and inlined into the built UI.
- `src/code.ts` — plugin sandbox entry point and UI message handler.
- `src/ui.ts` — iframe entry point, controls, archive generation, and download.
- `src/custom.d.ts` — asset module declarations.
- `src/export/constants.ts` — mapping from Figma font-style labels to CSS font
  weights.
- `src/export/types.ts` — narrowed input and prepared text-style types.
- `src/export/export-text-styles/index.ts` — SCSS mixin and index serialization.
- `src/export/utils/styles-text.ts` — style loading, grouping, naming, and
  typography value preparation.
- `src/export/utils/variable.ts` — Figma variable lookup and CSS custom-property
  name preparation.
- `webpack.config.js` — builds the sandbox and UI bundles.
- `dist/code.js` and `dist/ui.html` — generated artifacts loaded by Figma.

## Source of truth and generated files

Edit files under `src/`, `ui.html`, or `public/`. Do not hand-edit files under
`dist/`.

Webpack generates:

- `src/code.ts` and imported modules -> `dist/code.js`
- `src/ui.ts`, `ui.html`, imported dependencies, and imported assets ->
  `dist/ui.html`

The generated `dist` files are committed because `manifest.json` points Figma
to them. After changing source code, run `npm run build` and include the
corresponding generated changes.

`package-lock.json` is npm-generated. Update it through npm rather than editing
it manually.

## Export contract

### File grouping

The first `/`-separated segment of a Figma text-style name determines the SCSS
file name.

```text
Heading/H1        -> heading.scss
Heading/H2        -> heading.scss
Body/Regular      -> body.scss
```

Each generated file contains all mixins assigned to that group. `index.scss`
contains one `@import` for each generated group file.

### Naming

Style names are normalized by:

1. Replacing whitespace, `/`, `(`, and `)` runs with `-`.
2. Converting to lowercase.
3. Collapsing repeated `-` characters.

Mixin names use the full normalized Figma style name:

```text
Heading/H1 -> text-style-heading-h1-mixin
```

Variable names are converted to lowercase and `/`, `.`, and spaces are replaced
with `-`:

```text
Typography/Font.Family -> var(--typography-font-family)
```

Preserve these rules unless a task explicitly changes the public generated
output. Naming changes can be breaking changes for consumers of the SCSS.

### Exported properties

Each mixin can contain:

- `font-size`
- `font-family`
- `font-weight`

Properties with `null` or another falsy value are omitted. The exporter does
not currently include line height, letter spacing, text case, decoration,
paragraph properties, fills, or other text-style fields.

The generated shape is:

```scss
/*figma style name: Heading/H1*/
@mixin text-style-heading-h1-mixin {
	font-size: 24px;
	font-family: 'Inter', Arial, sans-serif;
	font-weight: 700;
}
```

Generated mixin declarations use tab indentation. Avoid unrelated output
formatting changes when fixing behavior.

### Variable behavior

The UI checkbox controls whether bound Figma variables are used for supported
properties.

- When enabled and a usable variable is bound to `fontFamily` or `fontWeight`,
  the exporter emits `var(--normalized-variable-name)`.
- When disabled, missing, or unresolved, `font-family` falls back to
  `'Figma Font Family', Arial, sans-serif`.
- `font-weight` falls back to a normalized value from the Figma font style.
  Common labels such as `Regular`, `Semibold`, and `Bold` map to `400`, `600`,
  and `700`. Numeric weights from `100` through `900` are preserved. `italic`
  and `oblique` text is removed before matching.

Only variables bound to the supported text-style properties are resolved. This
is not a general Figma variables exporter.

## Figma constraints

`manifest.json` defines the behavior agents must preserve unless a task
explicitly changes it:

- Main entry: `dist/code.js`
- UI entry: `dist/ui.html`
- Editors: Figma and Dev Mode
- Document access: `dynamic-page`
- Network access: no allowed domains
- Capability: `inspect`

Use asynchronous Figma API methods compatible with dynamic-page access, such as
`figma.getLocalTextStylesAsync()` and
`figma.variables.getVariableByIdAsync()`.

The exporter reads local text styles only. It does not fetch remote library
styles, and the plugin cannot rely on network requests under the current
manifest.

## Development workflow

Install dependencies:

```sh
npm install
```

Create a one-time build:

```sh
npm run build
```

Rebuild continuously during development:

```sh
npm run watch
```

Run static checks:

```sh
npm run lint
```

Apply supported ESLint fixes:

```sh
npm run lint:fix
```

There is currently no automated test script or test suite. Do not claim tests
passed when only linting and building were run.

To test manually in Figma:

1. Build the project.
2. Import or reload the plugin using `manifest.json`.
3. Open a file containing local text styles.
4. Test export with the variable checkbox enabled and disabled.
5. Inspect the downloaded ZIP, generated group files, mixin values, and
   `index.scss`.
6. Also test a file with no local text styles and confirm the empty-state
   message.

## Change guidelines

- Read the relevant source and trace both runtimes before editing message or UI
  behavior.
- Keep message payloads explicitly typed where practical.
- Extend `TFigmaTextStyle` and `TPreparedTextStyle` when adding exported
  properties; they intentionally represent only the subset currently used.
- Keep style preparation separate from SCSS serialization.
- Prefer small, readable changes and early returns.
- Remove code and dependencies that become unused; do not restore deleted
  token-export utilities unless a task explicitly requires that functionality.
- Preserve user-facing output and naming compatibility unless the requested
  change intentionally alters the export contract.
- Handle absent styles, missing variable bindings, unresolved variable IDs, and
  unsupported font-weight labels without crashing.
- Do not add network-dependent behavior without also addressing the manifest's
  `allowedDomains` restriction.
- Update this guide when architecture, scripts, message contracts, generated
  files, or export rules change.

## Verification checklist

For normal source changes:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Review generated `dist` changes and confirm they correspond to source
   changes.
4. Manually test in Figma when the change affects runtime behavior or generated
   SCSS.

For documentation-only changes, verify paths, commands, and behavior against
the current source. A build is not required unless source files changed.
