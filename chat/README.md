# SEP:Chat landing

Адаптивная локальная верстка по десктопному и мобильному макетам Figma.

Адрес сайта: `https://pksep.ru/chat/`. API отправки: `https://pksep.ru/api/chat/leads`.
В серверном ENV: `ALLOWED_ORIGINS=https://pksep.ru`, без `/chat/`.

## Запуск

Откройте `chat/index.html` двойным щелчком в Finder. CSS, скрипт и изображения подключены относительными путями и работают без локального сервера.

Если нужен адрес `localhost`, из папки `chat` запустите:

```sh
python3 -m http.server 4173
```

Затем откройте `http://localhost:4173`.

Навигация в шапке прокручивает страницу к разделам; целевые кнопки открывают форму. Все три формы отправляют заявки на `POST /api/chat/leads` того же домена. Подтверждение появляется только после положительного ответа SMTP. Без работающего API данные сохраняются, а интерфейс сообщает об ошибке, не об успехе.

## SMTP-конфигурация для DevOps

Готовый обработчик: `backend/chat/`. Шаблон: [deploy/chat/.env.example](../deploy/chat/.env.example).
Полная инструкция, nginx и systemd: [deploy/chat/README.md](../deploy/chat/README.md).
Пароль и случайный HMAC-секрет заполняются только на сервере; без них API не запускается.
Получатель и отправитель фиксированы: `info@pksep.ru`, тема «Заявка на демонстрацию SEP:Chat».
Путь API и порт 3002 отдельные от ERP: его отправка не затрагивается.

Старый игнорируемый `deploy/chat/.env` сохранён без изменений и **не является полным новым конфигом**. Для нового сервиса использовать обновлённый `.env.example`, а не копировать старый файл.

## Локальная проверка с API

Обычный Python-сервер показывает вёрстку, но не проксирует API. Для полной проверки:

```sh
cd backend/chat
npm ci --ignore-scripts
node --env-file=/absolute/private/path/chat-mail.env server.mjs
```

В отдельном терминале из `backend/chat`: `npm run preview`, затем открыть
`http://127.0.0.1:4174`. В приватном ENV задать `ALLOWED_ORIGINS=http://127.0.0.1:4174`,
`TRUST_PROXY=false`, `PORT=3002`, путь БД вне публичного `chat/` и рабочие SMTP-настройки.
Preview слушает только loopback; не использовать для production.

Автотесты: `npm test`; браузерные проверки: `npm run test:browser` (установленный Chrome,
или `BROWSER_CHANNEL=chromium` после установки Chromium через Playwright).
Тесты не обращаются к Majordomo и не отправляют реальных писем.
