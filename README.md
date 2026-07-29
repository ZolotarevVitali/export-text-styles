# Export Text Styles

A Figma plugin that exports local text styles as grouped SCSS mixins in a
`text-styles.zip` archive.

## Development

Install dependencies:

```sh
npm install
```

Run regression tests and static checks:

```sh
npm test
npm run typecheck
npm run lint
```

Create production bundles in `dist/`:

```sh
npm run build
```

Rebuild development bundles while editing:

```sh
npm run watch
```

## Test in Figma

1. Build the plugin.
2. Import or reload it using `manifest.json`.
3. Open a file containing local text styles.
4. Export with “Use variables” enabled and disabled.
5. Inspect the generated mixins and `index.scss` inside the downloaded ZIP.

See `AGENTS.md` for the export contract and repository architecture.
