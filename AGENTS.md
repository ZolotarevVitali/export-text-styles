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
- Vitest, V8 coverage, Happy DOM, and Dart Sass for regression tests
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
  -> parent.postMessage({
       pluginMessage: { type: 'export', requestId, variableMode }
     })
  -> figma.ui.onmessage in src/code.ts
  -> handleExportRequest(message)
  -> exportTextStyles({ variableMode })
  -> getTextStyles({ variableMode })
  -> figma.getLocalTextStylesAsync()
  -> prepare and group styles
  -> build Record<fileName, scssContent> plus index.scss
  -> figma.ui.postMessage({
       type: 'export-text-styles',
       requestId,
       textStyles
     })
  -> window.onmessage in src/ui.ts
  -> JSZip generates text-styles.zip
  -> browser download is triggered
```

If no local text styles exist, `exportTextStyles` returns `null` and the UI
shows `No text styles found`.

Failures produce `export-text-styles-error` with the matching `requestId`, clear
the loading state, and display an error. When changing this protocol, update
both sender and receiver together and keep message types synchronized in
`src/messages.ts`.

The variable mode defaults to `name`. On startup, the sandbox restores the
last valid selection from `figma.clientStorage` and sends it to the UI. Select
changes send `save-variable-mode` back to the sandbox for plugin-scoped local
persistence.

## Source map

- `manifest.json` — Figma plugin metadata and runtime entry points.
- `ui.html` — UI markup and styles used as the Webpack HTML template.
- `public/vzlogo.png` — logo imported and inlined into the built UI.
- `src/code.ts` — plugin sandbox entry point and UI message handler.
- `src/export-request.ts` — request execution and success/error response
  creation.
- `src/messages.ts` — shared plugin request and response types.
- `src/ui.ts` — iframe entry point, controls, archive generation, and download.
- `src/custom.d.ts` — asset module declarations.
- `src/export/constants.ts` — mapping from Figma font-style labels to CSS font
  weights.
- `src/export/types.ts` — narrowed input and prepared text-style types.
- `src/export/export-text-styles/index.ts` — SCSS mixin and index serialization.
- `src/export/utils/styles-text.ts` — style loading, grouping, naming, and
  typography value preparation.
- `src/export/utils/scss.ts` — SCSS-safe naming, escaping, and stable suffixes.
- `src/export/utils/variable.ts` — Figma variable lookup and CSS custom-property
  name preparation.
- `src/**/*.test.ts` — sandbox, UI, exporter, message, and utility regression
  tests. UI tests use Happy DOM.
- `vitest.config.ts` — test coverage configuration and enforced thresholds.
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
it manually. `node_modules` is ignored and must not be committed.

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

Style and group names are normalized by:

1. Converting compatible accented Latin characters to their base form.
2. Replacing non-alphanumeric runs with `-`.
3. Converting to lowercase and trimming repeated/edge `-` characters.
4. Falling back to `unnamed` when no identifier characters remain.

Mixin names use the full normalized Figma style name:

```text
Heading/H1 -> text-style-heading-h1
```

Each prepared style also keeps the exact Figma style name in `originalName`.
The exporter writes it unchanged in the comment above the mixin so users can
find the corresponding style in Figma even when the mixin identifier is
normalized:

```scss
/*figma style name: Text/Body/3XL/- bold (AB)*/
%text-style-text-body-3xl-bold-ab {
  /* properties */
}
```

Escape `originalName` only as needed to keep the SCSS comment safe; do not
normalize it or replace it with `mixinName`.

Names remain unchanged when their normalized result is unique. If distinct
groups or styles normalize to the same name, every conflicting output receives
a stable hash suffix. Mixin suffixes include the Figma style ID so duplicate
style names are preserved. The reserved `index` group is always suffixed so it
cannot overwrite `index.scss`.

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
- `line-height`
- `letter-spacing`
- `font-style`
- `text-transform`
- `text-decoration`
- `text-indent`

Properties with `null` or another falsy value are omitted. The exporter does
not currently include paragraph spacing, list spacing, leading trim, hanging
punctuation, hanging lists, fills, or other text-style fields.

Typography values are converted to CSS as follows:

- Numeric typography values are rounded to at most four decimal places, and
  trailing zeroes are omitted.
- Pixel line heights use `px`, percentage line heights use `%`, and automatic
  line heights use `normal`.
- Pixel letter spacing uses `px`. Percentage letter spacing is divided by 100
  and emitted as `em`, because CSS `letter-spacing` does not accept percentages.
- Font style names containing `italic` or `oblique` emit the corresponding CSS
  value; other non-empty style names emit `normal`.
- `ORIGINAL`, `UPPER`, `LOWER`, and `TITLE` text cases emit `none`, `uppercase`,
  `lowercase`, and `capitalize`.
- Small-caps text cases are omitted because their CSS equivalent is
  `font-variant-caps`, not `text-transform`.
- `NONE`, `UNDERLINE`, and `STRIKETHROUGH` decorations emit `none`, `underline`,
  and `line-through`.
- Paragraph indent is emitted as `text-indent` in pixels.

The generated shape is:

```scss
/*figma style name: Heading/H1*/
%text-style-heading-h1 {
  font-size: 24px;
  font-family: 'Inter';
  font-weight: 700;
  line-height: 120%;
  letter-spacing: -0.02em;
  font-style: normal;
  text-transform: none;
  text-decoration: none;
  text-indent: 0px;
}
```

Generated mixin declarations use tab indentation. Avoid unrelated output
formatting changes when fixing behavior.

### Variable behavior

The UI “Apply variables” select controls how bound Figma variables are used for
supported properties:

- `None` emits the text style's own values.
- `Variable name` emits `var(--normalized-variable-name)` and is the default.
- `Variable value` reads the variable collection's default mode. Aliases are
  resolved recursively using each referenced collection's default mode.

Variable modes apply to `font-size`, `font-family`, `font-weight`,
`line-height`, `letter-spacing`, `font-style`, and `text-indent`. Their
corresponding Figma fields are `fontSize`, `fontFamily`, `fontWeight`,
`lineHeight`, `letterSpacing`, `fontStyle`, and `paragraphIndent`. Text case
and decoration do not support variable bindings on Figma text styles.

For variable values, font families keep the generated
`"Figma Font Family"` shape with SCSS string escaping.
Font weights use the same normalization as style values. Common labels such as
`Regular`, `Semibold`, and `Bold` map to `400`, `600`, and `700`. Integer
numeric weights from `1` through `1000` are preserved. `italic` and `oblique`
text is removed before matching. Numeric font-size and paragraph-indent
variables use pixels. Numeric line-height and letter-spacing variables use the
unit from the bound text-style property. Font-style variables use the same
normalization as the text style's font name.

Missing variables, unresolved or cyclic aliases, unsupported value types, and
invalid property values fall back to the text style's own value.

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

This creates production bundles without inline source maps.

Rebuild continuously during development:

```sh
npm run watch
```

This creates development bundles continuously.

Run static checks:

```sh
npm run lint
```

Apply supported ESLint fixes:

```sh
npm run lint:fix
```

Run regression tests:

```sh
npm test
```

Run regression tests with coverage:

```sh
npm run test:coverage
```

Coverage is enforced at 100% for statements, branches, functions, and lines in
executable TypeScript under `src/`. Tests, generated output, declarations, and
type-only modules are excluded.

Run strict type checks for plugin and test code:

```sh
npm run typecheck
```

To test manually in Figma:

1. Build the project.
2. Import or reload the plugin using `manifest.json`.
3. Open a file containing local text styles.
4. Test export with None, Variable name, and Variable value selected.
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

1. Run `npm run test:coverage`.
2. Run `npm test`.
3. Run `npm run typecheck`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Review generated `dist` changes and confirm they correspond to source
   changes.
7. Manually test in Figma when the change affects runtime behavior or generated
   SCSS.

For documentation-only changes, verify paths, commands, and behavior against
the current source. A build is not required unless source files changed.
