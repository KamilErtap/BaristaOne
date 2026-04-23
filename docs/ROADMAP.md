# BaristaOne Roadmap

## Proje Vizyonu

BaristaOne, küçük ve orta ölçekli kafeler için geliştirilen web ve mobil destekli bir sipariş, menü ve operasyon yönetim sistemidir.

Nihai hedef; müşterilerin masadan sipariş verebildiği, adminlerin menüyü ve siparişleri yönetebildiği, mutfak ve garson ekranlarıyla operasyonun takip edilebildiği, ilerleyen aşamalarda Docker, CI/CD, Redis, RabbitMQ ve mobil uygulama desteğiyle profesyonel bir ürüne dönüşmesidir.

---

# v1.0 - Ders Projesi Temel Sürüm

## Tamamlanan Özellikler

### Backend
- Node.js ve Express tabanlı API oluşturuldu.
- MongoDB ve Mongoose bağlantısı kuruldu.
- Kullanıcı kayıt ve giriş sistemi eklendi.
- JWT tabanlı kimlik doğrulama yapıldı.
- Admin ve customer rolleri oluşturuldu.
- Menü CRUD işlemleri yapıldı.
- Menü kategorileri listelenebilir hale getirildi.
- Sipariş oluşturma sistemi eklendi.
- Kullanıcının kendi siparişlerini görüntülemesi sağlandı.
- Admin kullanıcının tüm siparişleri görüntülemesi sağlandı.
- Admin kullanıcının sipariş durumunu güncellemesi sağlandı.

### Frontend
- React ve Vite ile frontend oluşturuldu.
- Login ve register sayfaları yapıldı.
- Menü listeleme, filtreleme ve sıralama eklendi.
- Sepete ürün ekleme sistemi oluşturuldu.
- Masa numarası ile sipariş oluşturma akışı eklendi.
- Kullanıcı siparişleri sayfası yapıldı.
- Admin menü ve sipariş yönetimi sayfaları oluşturuldu.
- Ürün detay sayfası eklendi.
- Admin ürün detay ve güncelleme sayfası eklendi.

---

# v1.5 - Profesyonel Temel ve Refactor

## Amaç

Projeyi ders projesi görünümünden çıkarıp sürdürülebilir, genişletilebilir ve profesyonel ürün altyapısına hazırlamak.

## Backend Hedefleri

1. API response formatını standartlaştırmak.

```json
{
  "success": true,
  "message": "İşlem başarılı",
  "data": {}
}
```

2. Merkezi hata yönetimini güçlendirmek.
3. Validation sistemi eklemek.
4. Controller içindeki iş mantığını service layer yapısına taşımak.
5. Backend klasör yapısını profesyonelleştirmek.

Hedef backend yapısı:

```text
backend/
  src/
    config/
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

## Frontend Hedefleri

1. Ortak component sistemi kurmak.
2. CartContext eklemek.
3. Checkout sayfası oluşturmak.
4. AdminLayout ve Sidebar eklemek.
5. Frontend klasör yapısını modüler hale getirmek.

Hedef frontend yapısı:

```text
frontend/
  src/
    api/
    components/
      common/
      layout/
    context/
    features/
      auth/
      menu/
      orders/
      admin/
    routes/
    App.jsx
    main.jsx
```

---

# v2.0 - Gerçek Kafe Operasyonu

## Müşteri Tarafı

- Kalıcı sepet
- Checkout sayfası
- Sipariş takip ekranı
- Masa numarası bazlı sipariş
- QR kod ile masa menüsü açma
- Sipariş geçmişi
- Aynı siparişi tekrar verme

## Admin / Owner Tarafı

- Admin dashboard
- Günlük sipariş sayısı
- Günlük gelir
- En çok satan ürünler
- Aktif siparişler
- Menü kategorileri yönetimi
- Masa yönetimi
- Personel yönetimi

## Kitchen Screen

Route örneği:

```text
/kitchen
```

Özellikler:
- Yeni siparişleri görme
- Siparişi hazırlanıyor durumuna alma
- Siparişi hazır durumuna alma
- Sipariş süresini takip etme

## Waiter Screen

Route örneği:

```text
/waiter
```

Özellikler:
- Hazır siparişleri görme
- Masa numarasını görme
- Siparişi teslim edildi durumuna alma

## Rol Sistemi

Mevcut roller:

```text
admin
customer
```

Hedef roller:

```text
owner
admin
kitchen
waiter
customer
```

---

# v2.5 - Mobil Uygulama Hazırlığı

## Amaç

Aynı backend üzerinden mobil uygulama geliştirilebilecek hale gelmek.

Planlanan teknoloji:

```text
React Native + Expo
```

Planlanan ekranlar:
- Login
- Register
- Menu
- Product Detail
- Cart
- Checkout
- My Orders
- Kitchen Orders
- Waiter Orders
- Profile

---

# v3.0 - DevOps ve Ölçeklenebilirlik

## Docker

Hedef komut:

```bash
docker compose up
```

Servisler:
- backend
- frontend
- mongodb
- redis
- rabbitmq

## Redis

Kullanım alanları:
- Menü cache
- Kategori cache
- Dashboard cache
- Rate limiting
- Token blacklist
- Pub/Sub

## RabbitMQ

Planlanan eventler:

```text
order.created
order.status.updated
notification.send
daily.report.generate
```

## CI/CD

GitHub Actions ile otomatik süreçler kurulacak.

Backend pipeline:
- npm install
- lint
- test
- build kontrolü
- deploy

Frontend pipeline:
- npm install
- lint
- test
- npm run build
- deploy

---

# v3.5 - Test Altyapısı

Backend:
- Jest
- Supertest

Frontend:
- Vitest
- React Testing Library

E2E:
- Playwright

---

# v4.0 - Gerçek Ürün Sürümü

Eklenecekler:
- Cloudinary görsel upload
- QR masa linkleri
- Raporlama
- Monitoring
- Production deployment
- Custom domain
- Mobil uygulama

---

# İlk Sprint

## Sprint 1 - Profesyonel Temel

1. Frontend ortak component sistemi kurulacak.
2. CartContext oluşturulacak.
3. Checkout sayfası eklenecek.
4. AdminLayout ve Sidebar eklenecek.
5. Dashboard başlangıç sayfası yapılacak.
6. Backend response formatı standartlaştırılacak.
7. Backend validation sistemi eklenecek.
8. Proje dokümantasyonu güncellenecek.
