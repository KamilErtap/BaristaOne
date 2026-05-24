# BaristaOne Mobil Backend (REST API Bağlantısı) Görev Dağılımı

**REST API Adresi:** [https://barista-one-api.vercel.app/api](https://barista-one-api.vercel.app/api)

Bu dokümanda, BaristaOne mobil uygulamasının REST API ile iletişimini sağlayan backend entegrasyon görevleri listelenmektedir. Mobil uygulama React Native ve Expo ile geliştirilmiş, backend bağlantısı Axios üzerinden sağlanmıştır.

---

## Grup Üyelerinin Mobil Backend Görevleri

1. [Kamil Ertap'ın Mobil Backend Görevleri](Kamil-Ertap/Kamil-Ertap-Mobil-Backend-Gorevleri.md)

---

## Genel Mobil Backend Prensipleri

### 1. HTTP Client Yapılandırması

- **Base URL:** `https://barista-one-api.vercel.app/api`
- **HTTP Client:** Axios
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

Mobil uygulamada API bağlantıları merkezi `apiClient.js` dosyası üzerinden yönetilmiştir. Böylece tüm servis dosyaları aynı Axios instance üzerinden backend ile iletişim kurmaktadır.

### 2. Authentication Yönetimi

- JWT token mobil tarafta `AsyncStorage` içinde saklanmıştır.
- Login ve register sonrası token kaydedilmiştir.
- Uygulama tekrar açıldığında kayıtlı token kontrol edilmiştir.
- `GET /auth/me` isteğiyle mevcut kullanıcı doğrulanmıştır.
- API isteklerinde token otomatik olarak Authorization header içine eklenmiştir.
- 401 Unauthorized durumunda kayıtlı kullanıcı bilgisi temizlenmiştir.

### 3. Error Handling

- API hata mesajları kullanıcıya anlaşılır şekilde gösterilmiştir.
- Login, register, menü, checkout, QR masa ve sipariş ekranlarında hata state yönetimi yapılmıştır.
- Network veya backend hatalarında empty/error state bileşenleri kullanılmıştır.
- Sipariş oluşturma ve sipariş durumu güncelleme işlemlerinde başarılı/başarısız mesajlar gösterilmiştir.

### 4. Loading States

- API isteği başladığında loading state aktif hale getirilmiştir.
- Menü, ürün detay, siparişlerim, kitchen ve waiter ekranlarında loading ekranları kullanılmıştır.
- Form submit işlemlerinde buton loading/disabled hale getirilmiştir.
- Pull-to-refresh sırasında refreshing state yönetilmiştir.

### 5. Response Helper Yapısı

- API response formatlarını mobil tarafta daha kolay kullanmak için helper fonksiyonları yazılmıştır.
- `getAuthPayload()`
- `getItems()`
- `getCategories()`
- `getItem()`
- `getOrders()`
- `getTable()`

Bu yapı sayesinde farklı endpoint response formatları ekranlarda sade şekilde kullanılabilmiştir.

### 6. Backend Servis Dosyaları

Mobil uygulamada endpoint gruplarına göre servis dosyaları oluşturulmuştur:

- `authApi.js`
- `menuApi.js`
- `orderApi.js`
- `tableApi.js`
- `apiClient.js`

### 7. Role Based API Kullanımı

- Customer rolündeki kullanıcılar müşteri endpointlerini kullanmıştır.
- Kitchen, Waiter, Admin ve Owner rolleri personel sipariş endpointlerini kullanmıştır.
- Personel ekranlarında `GET /orders` ve `PUT /orders/:id/status` endpointleri kullanılmıştır.
- Müşteri ekranlarında `GET /orders/my-orders` endpointi kullanılmıştır.

### 8. Mobil Backend Güvenliği

- Token her istekte otomatik gönderilmiştir.
- Token bozulduğunda veya geçersiz olduğunda mobil storage temizlenmiştir.
- Role based navigation ile kullanıcıya uygun ekranlar gösterilmiştir.
- QR ile seçilen masa checkout ekranında kilitlenerek yanlış masa numarası girişi engellenmiştir.
