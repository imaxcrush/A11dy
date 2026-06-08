# Project Context

## Understanding Of The Task

Create a functional Vue 3 + TypeScript accessibility widget comparable in product scope to an accessibility overlay: a floating button opens a dialog panel, users choose accessibility modes, the page appearance changes globally, and settings persist across reloads.

UserWay is only a feature reference. The implementation must be original and must not copy UserWay code, styles, DOM structure, text, class names, icons, assets, or brand identity.

## Required Architecture

- `A11yWidgetPlugin` is installed via `app.use(A11yWidgetPlugin)`.
- The plugin creates and mounts the floating widget into `document.body` automatically.
- A reactive store owns the accessibility settings.
- Settings are reflected on `document.documentElement` with `data-a11y-*` attributes.
- Global visual changes are implemented through CSS variables and selectors in `a11y.css`.
- Settings are saved to and restored from `localStorage`.
- Speech controls use the browser Web Speech API.

## Required Files

- `src/plugins/a11y/index.ts`
- `src/plugins/a11y/A11yWidget.vue`
- `src/plugins/a11y/A11yPanel.vue`
- `src/plugins/a11y/A11yOptionButton.vue`
- `src/plugins/a11y/useA11yStore.ts`
- `src/plugins/a11y/useSpeech.ts`
- `src/plugins/a11y/a11y.css`
- `src/pages/A11yTestPage.vue`

## MVP Features

- Floating button with accessible ARIA state and focus return.
- Dialog panel with Escape close, close button, sections, and `aria-pressed` option buttons.
- Text scale modes: default, large, xlarge, max.
- Increased spacing mode.
- Contrast modes: default, dark, light, monochrome.
- Color perception modes: default, protanopia, deuteranopia, tritanopia.
- Navigation modes: underline links, enhanced focus, large cursor.
- Reduced motion mode.
- Speech controls: read main content, read selected text, pause, resume, stop, and rate from 0.7 to 1.5.
- Reset all settings.

## Test Page

The test page must include semantic and visual elements that clearly demonstrate text, contrast, color, link, focus, form, and motion changes: `main`, `h1`, paragraphs, links, buttons, success/warning/error/info cards, a form, and an animated block.
