# BaristaOne Mobile Plan

## Amaç

BaristaOne projesinin ilerleyen aşamada mobil uygulama haline getirilebilmesi için teknik ve işlevsel planın hazırlanmasıdır.

Mobil uygulama mevcut backend API yapısını kullanacaktır.

---

# 1. Planlanan Teknoloji

```text
React Native + Expo
```

---

# 2. Mobil Kullanıcı Tipleri

- customer
- admin
- kitchen
- waiter

Owner rolü ilk mobil sürümde opsiyonel tutulabilir.

---

# 3. Mobil Ekranlar

## Customer
- Login
- Register
- Menu
- Product Detail
- Cart
- Checkout
- My Orders
- Order Detail

## Admin
- Dashboard
- Menu Management
- Product Detail / Edit
- Orders
- Order Detail

## Kitchen
- Active Orders
- Preparing Orders
- Ready Button

## Waiter
- Ready Orders
- Table Detail
- Delivered Button

---

# 4. Mobil Auth Akışı

Kullanılacak endpointler:

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

## Token Saklama

Mobilde localStorage kullanılmaz.

Tercih:
- expo-secure-store

Alternatif:
- AsyncStorage

---

# 5. Mobil Menü Akışı

Kullanılacak endpointler:

```text
GET /api/menu
GET /api/menu/categories
GET /api/menu/:id
```

---

# 6. Mobil Sepet ve Checkout

Mobilde sepet context ile yönetilecek.

Hedef yapı:
- CartContext
- CheckoutScreen

Sepet verisi AsyncStorage ile geçici olarak saklanabilir.

---

# 7. Mobil Sipariş Akışı

Kullanılacak endpointler:

```text
POST /api/orders
GET /api/orders/my-orders
```

Sipariş body örneği:

```json
{
  "items": [
    {
      "menuItem": "urunId",
      "quantity": 2
    }
  ],
  "tableNumber": 4,
  "paymentStatus": "paid"
}
```

---

# 8. Mobil Admin Akışı

Kullanılacak endpointler:

```text
POST /api/menu
PUT /api/menu/:id
DELETE /api/menu/:id
GET /api/orders
PUT /api/orders/:id/status
```

Admin mobilde:
- ürünleri görebilir
- ürün düzenleyebilir
- siparişleri görebilir
- sipariş durumlarını değiştirebilir

---

# 9. Push Notification Planı

Planlanan teknoloji:

```text
Expo Push Notifications
```

Bildirimler:

## Customer
- Sipariş alındı
- Sipariş hazırlanıyor
- Sipariş hazır
- Sipariş teslim edildi

## Kitchen
- Yeni sipariş geldi

## Waiter
- Teslim edilmeyi bekleyen sipariş var

---

# 10. Mobil İçin Backend Hazırlıkları

- API response formatı standartlaştırılmalı.
- Token sistemi mobil uyumlu olmalı.
- Refresh token sistemi değerlendirilmeli.
- Role based access yapısı genişletilmeli.
- Görseller cloud tabanlı tutulmalı.
- Rate limiting uygulanmalı.

---

# 11. QR Masa Akışı

Örnek route:

```text
/table/12/menu
```

veya:

```text
/menu?table=12
```

QR okutulduğunda:
- masa numarası otomatik alınır
- kullanıcı menüye yönlendirilir
- sipariş verirken masa numarası otomatik dolar

---

# 12. Mobil Geliştirme Aşamaları

## Mobile v1.0
- Login
- Register
- Menu
- Product Detail
- Cart
- Checkout
- My Orders

## Mobile v1.5
- Admin Orders
- Admin Product Edit
- Kitchen Screen
- Waiter Screen

## Mobile v2.0
- Push notifications
- QR table flow
- Offline cache
- Better dashboard

---

# 13. Önerilen Mobil Klasör Yapısı

```text
mobile/
  src/
    api/
      axios.js
      authApi.js
      menuApi.js
      orderApi.js
    components/
      common/
    context/
      AuthContext.js
      CartContext.js
    screens/
      auth/
      menu/
      orders/
      admin/
      kitchen/
      waiter/
    navigation/
      AppNavigator.js
    utils/
```
