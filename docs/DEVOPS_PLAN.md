# BaristaOne DevOps Plan

## Amaç

BaristaOne projesinin Docker, CI/CD, Redis ve RabbitMQ gibi profesyonel altyapılara hazırlanması.

---

# 1. Mevcut Deployment

## Frontend

```text
https://barista-one-frontend.vercel.app
```

## Backend

```text
https://barista-one-api.vercel.app
```

## Database

```text
MongoDB Atlas
```

---

# 2. Environment Variables

Backend:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@cafe.com
ADMIN_PASSWORD=123456
```

Frontend:

```env
VITE_API_URL=https://barista-one-api.vercel.app/api
```

---

# 3. Docker Planı

## Hedef

```bash
docker compose up
```

## Servisler

- backend
- frontend
- mongodb
- redis
- rabbitmq

## İlk Compose Taslağı

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Hazırlanacak dosyalar:
- Dockerfile.backend
- Dockerfile.frontend
- docker-compose.yml
- .dockerignore

---

# 4. Redis Planı

Redis kullanım alanları:
- GET /api/menu cache
- GET /api/menu/categories cache
- Dashboard cache
- Rate limiting
- Token blacklist
- Pub/Sub

---

# 5. RabbitMQ Planı

Event listesi:

```text
order.created
order.status.updated
notification.send
daily.report.generate
```

Kullanım:
- Yeni sipariş oluşunca mutfak bildirimi
- Sipariş durumu değişince müşteri bildirimi
- Bildirim gönderme işlemlerinin arka planda yapılması
- Raporlama işlemlerinin queue üzerinden yönetilmesi

---

# 6. CI/CD Planı

Kullanılacak teknoloji:

```text
GitHub Actions
```

Backend pipeline:
1. Checkout
2. Node.js kurulumu
3. npm install
4. lint
5. test
6. deploy

Frontend pipeline:
1. Checkout
2. Node.js kurulumu
3. npm install
4. npm run build
5. deploy

Planlanan dosyalar:

```text
.github/workflows/backend.yml
.github/workflows/frontend.yml
```

---

# 7. Test Planı

Backend:
- Jest
- Supertest

Frontend:
- Vitest
- React Testing Library

E2E:
- Playwright

---

# 8. Production Hedefleri

Uzun vadede:
- Frontend: Vercel / Netlify
- Backend: Render / Railway / VPS
- Database: MongoDB Atlas
- Redis: Upstash / Redis Cloud
- RabbitMQ: CloudAMQP
- Images: Cloudinary
- Monitoring: Sentry / Grafana / Vercel Analytics

---

# 9. Öncelik Sırası

1. Vercel deployment stabil hale getirilecek.
2. Environment variable yapısı temizlenecek.
3. Docker local geliştirme için eklenecek.
4. CI/CD build kontrolü kurulacak.
5. Redis cache eklenecek.
6. RabbitMQ event sistemi eklenecek.
7. Test altyapısı kurulacak.
8. Monitoring eklenecek.
