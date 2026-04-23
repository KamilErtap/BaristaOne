# BaristaOne Architecture

## Genel Mimari

Mevcut yapı:

```text
React Frontend  ->  Express REST API  ->  MongoDB
```

Hedef yapı:

```text
Web Frontend
Mobile App
    |
    v
REST API Backend
    |
    +--> MongoDB
    +--> Redis
    +--> RabbitMQ
```

---

## Mevcut Teknoloji Yığını

### Frontend
- React
- Vite
- React Router
- Axios
- Context API
- CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

### Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

---

## Mevcut Backend Yapısı

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  utils/
  app.js
  server.js
```

## Hedef Backend Yapısı

```text
backend/
  src/
    config/
      db.js
      redis.js
      rabbitmq.js
    controllers/
    middlewares/
    models/
    routes/
    services/
    validators/
    utils/
    constants/
    app.js
    server.js
```

---

## Mevcut Frontend Yapısı

```text
frontend/
  src/
    api/
    components/
    context/
    pages/
    App.jsx
    main.jsx
    index.css
```

## Hedef Frontend Yapısı

```text
frontend/
  src/
    api/
      axios.js
      authApi.js
      menuApi.js
      orderApi.js

    components/
      common/
      layout/

    context/
      AuthContext.jsx
      CartContext.jsx

    features/
      auth/
      menu/
      orders/
      admin/

    routes/
      AppRoutes.jsx

    App.jsx
    main.jsx
```

---

## API Akışı

### Auth

```text
authRoutes -> authController -> User Model -> JWT Response
```

### Menü

```text
menuRoutes -> menuController -> MenuItem Model -> Menu Response
```

### Sipariş

```text
orderRoutes -> orderController -> MenuItem + Order Models -> Order Response
```

---

## Roller

Mevcut roller:
- admin
- customer

Hedef roller:
- owner
- admin
- kitchen
- waiter
- customer

| Rol | Yetki |
|---|---|
| owner | Tüm sistem, raporlar, personel yönetimi |
| admin | Menü ve sipariş yönetimi |
| kitchen | Hazırlanacak siparişleri yönetir |
| waiter | Hazır siparişleri teslim eder |
| customer | Menü görüntüler, sipariş verir |

---

## Veri Modelleri

### User
- name
- email
- password
- role
- createdAt
- updatedAt

### MenuItem
- name
- description
- price
- category
- image
- isAvailable
- createdAt
- updatedAt

### Order
- customer
- items
- tableNumber
- totalPrice
- paymentStatus
- orderStatus
- createdAt
- updatedAt

---

## Gelecek Veri Modelleri

### Category
- name
- description
- isActive

### Table
- number
- qrCode
- isActive

### Payment
- order
- amount
- status
- method

### Notification
- user
- title
- message
- isRead

---

## Teknik Prensipler

- API response formatı standart olmalı.
- Controller dosyalarında iş mantığı minimum olmalı.
- Business logic service layer içinde olmalı.
- Validation middleware ile yapılmalı.
- Frontend component tabanlı olmalı.
- Sepet global context ile yönetilmeli.
- Mobil uygulama aynı backend API yapısını kullanabilmeli.
- DevOps araçları aşamalı şekilde eklenmeli.
