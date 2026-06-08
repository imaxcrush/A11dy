# Vue Accessibility Widget

Vue 3 + TypeScript accessibility overlay/widget with persistent user settings, global `data-a11y-*` attributes, CSS variables, localStorage, and Web Speech API support.

## Features

- Floating accessibility button mounted automatically through Vue plugin.
- Accessible dialog panel with keyboard close and focus return.
- Text scaling, spacing, contrast, color perception, navigation, reduced motion, and speech controls.
- Settings persisted in `localStorage`.
- Visual changes driven by CSS variables and `data-a11y-*` attributes on `<html>`.
- Standalone DevTools injection mode for testing on real sites.

## Vue Usage

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { A11yWidgetPlugin } from './plugins/a11y'
import './plugins/a11y/a11y.css'

createApp(App)
  .use(A11yWidgetPlugin)
  .mount('#app')
```

## Local Development

```bash
npm install
npm run dev
```

For HTTPS standalone testing:

```bash
npm run dev:https
```

## Documentation

Full plugin documentation is in [`docs/a11y-widget.md`](docs/a11y-widget.md).

## Build

```bash
npm run build
```
