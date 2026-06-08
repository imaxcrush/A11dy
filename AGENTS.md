# AGENTS.md

## Project Role

This repository contains a Vue 3 + TypeScript accessibility overlay/widget plugin.

## Implementation Rules

- Build with Vue 3, TypeScript, Composition API, CSS variables, `data-a11y-*` attributes on `document.documentElement`, `localStorage`, and the Web Speech API.
- The plugin must be installed with `app.use(A11yWidgetPlugin)` and auto-mount a floating widget into `document.body`.
- User settings live in a reactive store and are applied globally through `data-a11y-*` attributes and CSS variables.
- Do not use UserWay code, DOM structure, CSS, class names, copy, icons, assets, or branding.
- Do not mass-patch the DOM with `querySelectorAll('*')`.
- Do not apply per-element inline styles.
- Keep changes scoped to the accessibility plugin and the test page unless the application shell needs minimal wiring.

## Verification

- Verify that the widget mounts after plugin installation.
- Verify panel open/close behavior, including Escape close and focus returning to the floating button.
- Verify that settings update `data-a11y-*` attributes on `<html>`.
- Verify persistence through `localStorage`.
- Verify CSS variable driven visual changes on the test page.
- Verify speech controls use the Web Speech API when available.
