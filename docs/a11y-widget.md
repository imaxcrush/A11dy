# Accessibility Widget Documentation

## Назначение

Плагин добавляет на сайт accessibility widget: плавающая кнопка открывает панель настроек, пользователь включает режимы доступности, визуальное состояние страницы меняется глобально, а выбранные настройки сохраняются между перезагрузками.

Реализация написана на Vue 3 + TypeScript и может работать в двух режимах:

- как Vue-плагин через `app.use(A11yWidgetPlugin)`;
- как standalone-инъекция для тестирования на реальном сайте через DevTools Console.

UserWay использовался только как продуктовый ориентир по набору возможностей. Код, стили, DOM-структура, тексты, классы, иконки, ассеты и бренд UserWay не используются.

## Подключение В Vue

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { A11yWidgetPlugin } from './plugins/a11y'
import './plugins/a11y/a11y.css'

createApp(App)
  .use(A11yWidgetPlugin)
  .mount('#app')
```

После `.use(A11yWidgetPlugin)` плагин сам создаёт root-элемент и монтирует floating widget в `document.body`.

## Standalone-Тестирование

Для проверки на чужом HTTPS-сайте запусти локальный HTTPS dev-server:

```bash
npm run dev:https
```

Открой один раз `https://127.0.0.1:5173/` или `https://localhost:5173/` и прими локальный сертификат в браузере.

Затем на реальном сайте вставь в DevTools Console:

```js
(() => {
  window.__VUE_A11Y_WIDGET_STANDALONE__?.unmount()
  document.getElementById('a11y-widget-dev-loader')?.remove()

  const script = document.createElement('script')
  script.id = 'a11y-widget-dev-loader'
  script.type = 'module'
  script.src = `https://127.0.0.1:5173/src/plugins/a11y/standalone.ts?t=${Date.now()}`

  document.head.appendChild(script)
})()
```

Удалить standalone-виджет можно так:

```js
window.__VUE_A11Y_WIDGET_STANDALONE__?.unmount()
```

Если сайт блокирует скрипт через CSP, инъекция из DevTools может не сработать. Для таких сайтов нужен production bundle, bookmarklet или browser extension.

## Основные Файлы

- `src/plugins/a11y/index.ts` — Vue plugin entry.
- `src/plugins/a11y/standalone.ts` — standalone entry для DevTools-инъекции.
- `src/plugins/a11y/A11yWidget.vue` — floating button и состояние открытия панели.
- `src/plugins/a11y/A11yPanel.vue` — dialog-панель настроек.
- `src/plugins/a11y/A11yOptionButton.vue` — переиспользуемая кнопка режима с `aria-pressed`.
- `src/plugins/a11y/useA11yStore.ts` — reactive store, localStorage, применение `data-a11y-*`.
- `src/plugins/a11y/useSpeech.ts` — Web Speech API.
- `src/plugins/a11y/useA11ySurfaceDetector.ts` — детектор крупных зон страницы для структурной обводки в contrast mode.
- `src/plugins/a11y/a11y.css` — CSS variables, global accessibility rules, widget UI.
- `src/pages/A11yTestPage.vue` — тестовая страница.

## Архитектура

### Plugin Entry

`A11yWidgetPlugin.install()`:

1. Инициализирует store через `useA11yStore()`.
2. Проверяет, что код выполняется в браузере.
3. Проверяет, что root виджета ещё не создан.
4. Создаёт `div#vue-a11y-widget-root`.
5. Монтирует в него `A11yWidget`.

Это позволяет подключить виджет один раз на уровне приложения.

### Reactive Store

`useA11yStore.ts` содержит singleton reactive-state:

- размер текста;
- интервалы;
- контраст;
- цветовое восприятие;
- underline links;
- enhanced focus;
- large cursor;
- reduced motion;
- speech rate.

При инициализации store:

1. Читает настройки из `localStorage`.
2. Валидирует значения.
3. Применяет настройки к `document.documentElement`.
4. Подписывается на изменения и сохраняет их обратно в `localStorage`.

### Data-Атрибуты

Настройки применяются на `<html>`:

```html
<html
  data-a11y-text="large"
  data-a11y-spacing="increased"
  data-a11y-contrast="contrast-dark"
  data-a11y-color="default"
  data-a11y-underline-links="true"
  data-a11y-enhanced-focus="true"
  data-a11y-large-cursor="false"
  data-a11y-reduced-motion="false"
  data-a11y-speech-rate="1.0"
>
```

CSS читает эти атрибуты и меняет визуал страницы.

## Режимы

### Текст

- `default`
- `large` — 120%
- `xlarge` — 150%
- `max` — 200%

Для обычного Vue-приложения базовый размер меняется через `html { font-size: ... }`.

Для реальных сайтов, где размеры часто заданы в `px`, добавлен более сильный CSS-layer для типовых текстовых элементов.

### Интервалы

`increased` меняет:

- `line-height`;
- `letter-spacing`;
- `word-spacing`.

### Контраст

Доступные значения:

- `default`;
- `contrast-dark`;
- `contrast-light`;
- `monochrome`.

Контрастный режим меняет CSS variables и включает более жёсткий слой для реальных сайтов: фон, текст, ссылки, кнопки, формы и крупные поверхности.

### Цветовое Восприятие

Доступные значения:

- `default`;
- `protanopia`;
- `deuteranopia`;
- `tritanopia`.

Режимы реализованы через CSS `filter` на `body`.

### Навигация

- underline links;
- enhanced focus;
- large cursor.

Enhanced focus добавляет заметный `outline` для `:focus-visible`.

### Движение

Reduced motion уменьшает длительность animations/transitions и отключает smooth scroll.

### Речь

`useSpeech.ts` использует Web Speech API:

- читать `main`;
- читать выделенный текст;
- pause;
- resume;
- stop;
- speech rate от `0.7` до `1.5`.

Если браузер не поддерживает `speechSynthesis` или `SpeechSynthesisUtterance`, панель показывает ошибку или отключает часть действий.

## Структурная Обводка

На реальных сайтах одной CSS-эвристики недостаточно: классы и вложенность сильно отличаются. Поэтому для контрастных режимов используется `useA11ySurfaceDetector.ts`.

Он не обходит весь DOM через `querySelectorAll('*')`. Вместо этого он смотрит ограниченный набор кандидатов:

- chrome-зоны: `header`, `footer`, `nav`, `aside`, landmark roles, классы/id с `header/sidebar/aside`;
- surface-зоны внутри `main`: прямые `section/article/div`, элементы с `card/course/lesson/module/tile/surface/panel`, крупные ссылки-карточки.

Подход:

1. При включении contrast mode старые метки очищаются.
2. Крупные chrome-зоны получают `data-a11y-chrome="true"`.
3. Крупные карточки/поверхности внутри `main` получают `data-a11y-surface="true"`.
4. CSS рисует обводку только по этим data-атрибутам.
5. Потомки этих зон очищаются от лишних outline/box-shadow, чтобы не появлялась шумная сетка.

Обводка не использует inline-style.

## CSS Variables

Основные переменные:

```css
--a11y-font-scale
--a11y-line-height
--a11y-letter-spacing
--a11y-word-spacing
--a11y-page-bg
--a11y-surface-bg
--a11y-text-color
--a11y-muted-color
--a11y-border-color
--a11y-link-color
--a11y-accent-color
--a11y-accent-contrast
```

Контрастные режимы переопределяют эти переменные на уровне `html[data-a11y-contrast='...']`.

## Accessibility UI

Floating button:

- фиксирован в правом нижнем углу;
- имеет `aria-label`;
- имеет `aria-expanded`;
- имеет `aria-controls`;
- открывает/закрывает панель.

Panel:

- `role="dialog"`;
- `aria-label`;
- закрытие по `Esc`;
- кнопка закрытия;
- после закрытия фокус возвращается на floating button;
- активные режимы используют `aria-pressed`.

## Persistence

Настройки хранятся в:

```txt
localStorage["vue-a11y-widget-settings"]
```

При reload store восстанавливает настройки и сразу применяет их на `<html>`.

## Ограничения

На реальных сайтах результат зависит от структуры и CSS сайта.

Ограничения:

- Shadow DOM может не перекрашиваться внешним CSS.
- iframe не меняется, если он с другого origin.
- Canvas и растровые изображения нельзя полноценно перекрасить как DOM.
- CSP может заблокировать standalone-инъекцию.
- Если сайт массово использует `!important`, часть правил может не примениться.
- Классы без семантики могут не попасть в surface detector.

Для production-версии standalone-подключения лучше собрать отдельный bundle и подключать его как обычный script с доверенного домена.

## Проверка

Минимальный чеклист:

- Виджет появляется после `.use(A11yWidgetPlugin)`.
- Панель открывается и закрывается.
- `Esc` закрывает панель.
- Фокус возвращается на floating button.
- `<html>` получает `data-a11y-*`.
- Настройки сохраняются после reload.
- Контраст меняет страницу, кнопки, ссылки и формы.
- Большие поверхности получают обводку в contrast mode.
- Reduced motion останавливает демонстрационную анимацию.
- Speech controls используют Web Speech API.
- Reset возвращает настройки в default.
