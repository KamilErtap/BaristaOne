# Kamil Ertap'ın REST API Metotları

## 1. Üye Olma
- **Endpoint:** `POST /api/auth/register`
- **Açıklama:** Yeni kullanıcıların sisteme kayıt olmasını sağlar. Kullanıcılar ad, email adresi ve şifre bilgilerini girerek hesap oluşturabilir.
- **Request Body:** 
  ```json
  {
    "name": "Kamil Ertap",
    "email": "kamilertap@example.com",
    "password": "123456"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

## 2. Giriş Yapma
- **Endpoint:** `POST /api/auth/login`
- **Açıklama:** Kullanıcıların email adresi ve şifre ile sisteme giriş yapmasını sağlar. Başarılı girişten sonra kullanıcı bilgileri ve yetkilendirme için gerekli token döndürülür.
- **Request Body:**
  ```json
  {
    "email": "kamilertap@example.com",
    "password": "123456"
  }
  ```
- **Response:** `200 OK` - Giriş başarılı

## 3. Kullanıcı Bilgilerini Görüntüleme
- **Endpoint:** `GET /api/auth/me`
- **Açıklama:** Giriş yapmış kullanıcının kendi hesap bilgilerini görüntülemesini sağlar.
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı bilgileri başarıyla getirildi

## 4. Menüyü Görüntüleme
- **Endpoint:** `GET /api/menu`
- **Açıklama:** Kullanıcıların sistemde kayıtlı menü ürünlerini liste halinde görüntülemesini sağlar.
- **Response:** `200 OK` - Menü başarıyla getirildi

## 5. Menü Kategorilerini Görüntüleme
- **Endpoint:** `GET /api/menu/categories`
- **Açıklama:** Menüde yer alan ürün kategorilerini liste halinde görüntülemeyi sağlar.
- **Response:** `200 OK` - Kategoriler başarıyla getirildi

## 6. Tek Bir Menü Ürününü Görüntüleme
- **Endpoint:** `GET /api/menu/{urunId}`
- **Açıklama:** Belirli bir menü ürününün detaylı bilgilerini görüntülemeyi sağlar.
- **Path Parameters:** 
  - `urunId` (string, required) - Görüntülenecek ürünün ID bilgisi
- **Response:** `200 OK` - Ürün bilgisi başarıyla getirildi

## 7. Menüye Ürün Ekleme
- **Endpoint:** `POST /api/menu`
- **Açıklama:** Admin kullanıcısının menüye yeni ürün eklemesini sağlar.
- **Authentication:** Bearer Token gerekli ve admin yetkisi gerekir
- **Request Body:** 
  ```json
  {
    "name": "Latte",
    "description": "Sütlü kahve",
    "price": 120,
    "category": "Kahve",
    "image": "urun-gorseli.jpg",
    "isAvailable": true
  }
  ```
- **Response:** `201 Created` - Ürün başarıyla eklendi

## 8. Menü Ürünü Güncelleme
- **Endpoint:** `PUT /api/menu/{urunId}`
- **Açıklama:** Admin kullanıcısının menüde bulunan bir ürünü güncellemesini sağlar.
- **Path Parameters:** 
  - `urunId` (string, required) - Güncellenecek ürünün ID bilgisi
- **Authentication:** Bearer Token gerekli ve admin yetkisi gerekir
- **Response:** `200 OK` - Ürün başarıyla güncellendi

## 9. Menüden Ürün Silme
- **Endpoint:** `DELETE /api/menu/{urunId}`
- **Açıklama:** Admin kullanıcısının menüde yer alan bir ürünü silmesini sağlar.
- **Path Parameters:** 
  - `urunId` (string, required) - Silinecek ürünün ID bilgisi
- **Authentication:** Bearer Token gerekli ve admin yetkisi gerekir
- **Response:** `200 OK` - Ürün başarıyla silindi

## 10. Sipariş Verme
- **Endpoint:** `POST /api/orders`
- **Açıklama:** Kullanıcıların seçtikleri ürünlerle sipariş oluşturmasını sağlar. Sipariş oluşturulurken masa numarası girilir ve siparişin oluşabilmesi için ödeme durumunun yapılmış olması gerekir.
- **Authentication:** Bearer Token gerekli
- **Request Body:** 
  ```json
  {
    "items": [
      {
        "menuItem": "urunId1",
        "quantity": 2
      },
      {
        "menuItem": "urunId2",
        "quantity": 1
      }
    ],
    "tableNumber": 4,
    "paymentStatus": "paid"
  }
  ```
- **Response:** `201 Created` - Sipariş başarıyla oluşturuldu

## 11. Kendi Siparişlerini Görüntüleme
- **Endpoint:** `GET /api/orders/my-orders`
- **Açıklama:** Giriş yapmış kullanıcının kendi siparişlerini görüntülemesini sağlar.
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Siparişler başarıyla getirildi

## 12. Tüm Siparişleri Görüntüleme
- **Endpoint:** `GET /api/orders`
- **Açıklama:** Admin kullanıcısının sistemde bulunan tüm siparişleri liste halinde görüntülemesini sağlar.
- **Authentication:** Bearer Token gerekli ve admin yetkisi gerekir
- **Response:** `200 OK` - Siparişler başarıyla getirildi

## 13. Sipariş Durumu Güncelleme
- **Endpoint:** `PUT /api/orders/{orderId}/status`
- **Açıklama:** Admin kullanıcısının sipariş durumunu güncellemesini sağlar.
- **Path Parameters:** 
  - `orderId` (string, required) - Güncellenecek siparişin ID bilgisi
- **Authentication:** Bearer Token gerekli ve admin yetkisi gerekir
- **Request Body:** 
  ```json
  {
    "orderStatus": "ready"
  }
  ```
- **Response:** `200 OK` - Sipariş durumu başarıyla güncellendi
