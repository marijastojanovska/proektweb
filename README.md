# TeeShop Pro
Функции: админ со преглед на сите нарачки, професионален црвено/црн изглед, слајдер за производи,
хедер/футер + страници Почетна/За нас/Контакт/Производи/Новости/Најава/Регистрација/Кошничка

1) MongoDB (Atlas)
1. https://cloud.mongodb.com → кластер.
2. Database Access: корисник (username/password).
3. Network Access: твоја IP (или 0.0.0.0/0 за дев).
4. Drivers → копирај full connection string, пример:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tees?retryWrites=true&w=majority`

2) Backend
```bash
cd server
cp .env.example .env 
npm i
npm run seed          # админ (admin@shop.test / Admin123!)
npm run dev           # http://localhost:5000
```
`.env` пример:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_full_mongodb_uri_here
JWT_SECRET=long_random_secret_here
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:5173
RESEND_API_KEY=re_********************************
MAIL_FROM="TeeShop Pro <noreply@yourdomain.com>"
```

3) Frontend (локално)
```bash
cd client
cp .env.example .env   
npm i
npm run dev            # http://localhost:5173
```
4) Deploy (GitHub + Vercel)
- **Frontend** (client) на Vercel:
  - Project → Framework: Vite/React.
  - ENV: `VITE_API_URL` сетирај на твојот API URL 

5) Api
- `GET /api/health`
- `GET /api/products`, `GET /api/products/featured`, `GET /api/products/:id`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` 
- `POST /api/orders` 
- `GET /api/orders/mine` 
- `GET /api/orders` (Admin), `PATCH /api/orders/:id/status` (Admin)

6) Најава за админ
- По `npm run seed`: **admin@shop.test / Admin123!**
- Страница во фронтенд: `/admin/orders`

## Забелешки
- Овој проект користи **API-based е-пошта** (Resend) → нема потреба од SMTP/хостинг.
- Потребен е Node **>=18** (за `fetch` на backend).

