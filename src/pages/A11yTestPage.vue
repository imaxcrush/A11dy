<template>
  <main class="a11y-test-page" aria-labelledby="a11y-test-title">
    <div class="a11y-test-shell">
      <header class="a11y-test-header">
        <h1 id="a11y-test-title">Тестовая страница accessibility widget</h1>
        <p>
          Эта страница собрана так, чтобы сразу увидеть изменение размера текста, интервалов,
          контраста, цветового восприятия, ссылок, фокуса и анимации.
        </p>

        <nav class="a11y-test-links" aria-label="Тестовые ссылки">
          <a href="#cards">Карточки статусов</a>
          <a href="#form">Форма</a>
          <a href="#motion">Анимация</a>
          <a href="https://www.w3.org/WAI/" target="_blank" rel="noreferrer">WAI resources</a>
        </nav>

        <div class="a11y-test-actions">
          <button class="a11y-test-button" type="button">Основное действие</button>
          <button class="a11y-test-secondary" type="button">Вторичное действие</button>
        </div>
      </header>

      <section class="a11y-test-section" aria-labelledby="copy-title">
        <h2 id="copy-title">Текстовый блок</h2>
        <div class="a11y-test-copy">
          <p>
            В режиме крупного текста меняется базовый размер шрифта на странице. Это должно быть
            заметно в заголовках, абзацах, кнопках, полях формы и карточках.
          </p>
          <p>
            Увеличенные интервалы меняют line-height, letter-spacing и word-spacing через CSS
            variables. JavaScript не обходит все элементы страницы и не назначает им inline-style.
          </p>
          <p>
            Ссылки вроде <a href="#form">перехода к форме</a> помогают проверить режим подчёркивания
            и enhanced focus при навигации с клавиатуры.
          </p>
        </div>
      </section>

      <section id="cards" class="a11y-test-section" aria-labelledby="cards-title">
        <h2 id="cards-title">Карточки статусов</h2>
        <div class="a11y-card-grid">
          <article class="a11y-card a11y-card--success">
            <strong>Success</strong>
            <p>Зелёный статус показывает успешное завершение операции.</p>
          </article>
          <article class="a11y-card a11y-card--warning">
            <strong>Warning</strong>
            <p>Жёлтый статус нужен для предупреждений и заметных уведомлений.</p>
          </article>
          <article class="a11y-card a11y-card--error">
            <strong>Error</strong>
            <p>Красный статус помогает увидеть изменения контраста и цветовых режимов.</p>
          </article>
          <article class="a11y-card a11y-card--info">
            <strong>Info</strong>
            <p>Синий статус проверяет читаемость информационных сообщений.</p>
          </article>
        </div>
      </section>

      <section id="form" class="a11y-test-section" aria-labelledby="form-title">
        <h2 id="form-title">Форма</h2>
        <form class="a11y-test-form">
          <div class="a11y-test-field">
            <label for="name">Имя</label>
            <input id="name" name="name" autocomplete="name" placeholder="Анна Иванова">
          </div>

          <div class="a11y-test-field">
            <label for="topic">Тема</label>
            <select id="topic" name="topic">
              <option>Контраст</option>
              <option>Текст</option>
              <option>Речь</option>
            </select>
          </div>

          <div class="a11y-test-field">
            <label for="message">Сообщение</label>
            <textarea id="message" name="message" placeholder="Опишите, что нужно проверить"></textarea>
          </div>

          <button class="a11y-test-button" type="submit">Отправить</button>
        </form>
      </section>

      <section id="motion" class="a11y-test-section" aria-labelledby="motion-title">
        <h2 id="motion-title">Анимированный блок</h2>
        <div class="a11y-motion-demo" aria-label="Демонстрация движения">
          <div class="a11y-motion-demo__block">Motion</div>
        </div>
      </section>
    </div>
  </main>
</template>
