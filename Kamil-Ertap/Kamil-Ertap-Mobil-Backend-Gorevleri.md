# Kamil Ertap'ın Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek](https://example.com)

Bu dokümanda, BaristaOne mobil uygulamasının REST API ile bağlantı görevleri açıklanmaktadır. Mobil uygulama React Native ve Expo ile geliştirilmiş, backend bağlantısı Axios üzerinden sağlanmıştır.

**REST API Adresi:** `https://barista-one-api.vercel.app/api`

---

## 1. API Client Yapılandırması

- **Dosya:** `mobile/src/api/apiClient.js`
- **Görev:** Mobil uygulamanın backend ile iletişim kuracağı merkezi HTTP client yapısını oluşturmak.

### İşlevler

- Axios instance oluşturma
- Base URL yapılandırması
- JSON header tanımlama
- JWT token'ı AsyncStorage üzerinden okuma
- Token varsa `Authorization: Bearer {token}` header'ı ekleme
- 401 Unauthorized durumunda kayıtlı kullanıcı bilgisini temizleme

### Teknik Detaylar

- HTTP Client olarak Axios kullanılmıştır.
- API URL `mobile/src/config/env.js` dosyasına taşınmıştır.
- Tüm servis dosyaları ortak `apiClient` üzerinden backend'e istek göndermektedir.
- Response interceptor ile token geçersizliği kontrol edilmiştir.

---

## 2. Giriş Yapma Servisi

- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Mobil uygulamada kullanıcı giriş işlemini gerçekleştiren servis entegrasyonu.

### İşlevler

- Email ve şifre bilgilerini toplama
- API'ye POST isteği gönderme
- Başarılı girişte token ve kullanıcı bilgisini saklama
- Kullanıcı rolünü alarak role based navigation yapısına aktarma
- Hata durumlarında kullanıcıya mesaj gösterme

### Teknik Detaylar

- `authApi.login(payload)` fonksiyonu oluşturulmuştur.
- `AuthContext` ile login işlemi merkezi hale getirilmiştir.
- Token `AsyncStorage` içinde saklanmıştır.
- Login sonrası kullanıcı rolüne göre müşteri veya personel ekranlarına yönlendirme yapılmıştır.

---

## 3. Üye Olma Kayıt Servisi

- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Mobil uygulamada yeni kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu.

### İşlevler

- Ad soyad, email ve şifre bilgilerini toplama
- Form validasyonu yapma
- API'ye POST isteği gönderme
- Başarılı kayıt sonrası kullanıcıyı otomatik oturum açmış kabul etme
- Hata durumlarını yakalama ve kullanıcıya gösterme

### Teknik Detaylar

- `authApi.register(payload)` fonksiyonu oluşturulmuştur.
- Kayıt sonrası gelen token ve kullanıcı bilgisi `AuthContext` içine kaydedilmiştir.
- Kullanıcı bilgisi AsyncStorage'a yazılmıştır.
- Register ekranından Login ekranına geçiş desteği eklenmiştir.

---

## 4. Mevcut Kullanıcı Kontrol Servisi

- **API Endpoint:** `GET /api/auth/me`
- **Görev:** Uygulama açıldığında kayıtlı token'ın geçerli olup olmadığını kontrol etmek.

### İşlevler

- AsyncStorage içinden kayıtlı kullanıcı bilgisini okuma
- Token varsa backend'e kullanıcı doğrulama isteği gönderme
- Token geçerliyse kullanıcı oturumunu devam ettirme
- Token geçersizse kayıtlı kullanıcı bilgisini temizleme

### Teknik Detaylar

- `authApi.getMe()` fonksiyonu oluşturulmuştur.
- `AuthContext` içinde uygulama açılışında `loadUser()` fonksiyonu çalıştırılmıştır.
- Token doğrulama başarısız olursa kullanıcı login ekranına düşürülmüştür.
- Bu yapı sayesinde uygulama yeniden açıldığında oturum kalıcılığı sağlanmıştır.

---

## 5. Menü Listeleme Servisi

- **API Endpoint:** `GET /api/menu`
- **Görev:** Backend'deki menü ürünlerini mobil uygulamada listelemek.

### İşlevler

- Menü ürünlerini API'den çekme
- Ürünleri mobil kart yapısında gösterme
- Ürün adı, açıklama, kategori, fiyat ve görsel bilgilerini kullanma
- Pull-to-refresh ile listeyi yenileme
- API hatalarını kullanıcıya gösterme

### Teknik Detaylar

- `menuApi.getMenuItems(params)` fonksiyonu oluşturulmuştur.
- API response verisi `getItems(response)` helper fonksiyonu ile ayrıştırılmıştır.
- Menü ekranında loading, refreshing ve error state yönetimi yapılmıştır.
- Ürün kartına basıldığında detay ekranına geçiş yapılmıştır.

---

## 6. Menü Arama, Kategori ve Sıralama Servisleri

- **API Endpoint:** `GET /api/menu`
- **API Endpoint:** `GET /api/menu/categories`
- **Görev:** Mobil menü ekranında arama, kategori filtreleme ve sıralama özelliklerini backend ile bağlamak.

### İşlevler

- Ürün adına göre arama yapma
- Kategori listelerini API'den çekme
- Seçilen kategoriye göre ürünleri filtreleme
- Fiyat ve isim sıralama seçeneklerini API'ye gönderme
- Filtreleri temizleme

### Teknik Detaylar

- `menuApi.getCategories()` fonksiyonu oluşturulmuştur.
- `search`, `category` ve `sort` query parametreleri kullanılmıştır.
- Arama işleminde 350ms gecikmeli API çağrısı yapılmıştır.
- Kategori response'u `getCategories(response)` helper fonksiyonu ile ayrıştırılmıştır.

---

## 7. Ürün Detay Servisi

- **API Endpoint:** `GET /api/menu/:id`
- **Görev:** Seçilen ürünün detay bilgisini backend'den çekmek.

### İşlevler

- Ürün ID'sini navigation parametresi olarak alma
- Backend'den ürün detayını çekme
- Ürün bilgilerini detay ekranında gösterme
- Ürün müsait değilse sepete eklemeyi engelleme
- Hata durumunda empty state gösterme

### Teknik Detaylar

- `menuApi.getMenuItemById(id)` fonksiyonu oluşturulmuştur.
- API response `getItem(response)` helper fonksiyonu ile ayrıştırılmıştır.
- Ürün sepete eklenirken `CartContext.addToCart()` kullanılmıştır.
- Ürün detay ekranında loading ve error state yönetimi yapılmıştır.

---

## 8. Sipariş Oluşturma Servisi

- **API Endpoint:** `POST /api/orders`
- **Görev:** Mobil sepet içeriğini backend'in beklediği sipariş formatına dönüştürerek sipariş oluşturmak.

### İşlevler

- Sepetteki ürünleri toplama
- Masa numarasını alma
- Mobil sepet formatını backend sipariş formatına dönüştürme
- API'ye POST isteği gönderme
- Başarılı sipariş sonrası sepeti temizleme
- Kullanıcıyı Siparişlerim ekranına yönlendirme

### Backend'e Gönderilen Payload

```js
{
  items: [
    {
      menuItem: "menuItemId",
      quantity: 2
    }
  ],
  tableNumber: 4,
  paymentStatus: "paid"
}
```
### Teknik Detaylar

- orderApi.createOrder({ cart, tableNumber }) fonksiyonu oluşturulmuştur.
- Mobil tarafta cart içinde tutulan ürünler backend'in beklediği items formatına çevrilmiştir.
- paymentStatus: "paid" gönderilerek ödeme simülasyonu yapılmıştır.
- Sipariş başarılı olursa clearCart() çalıştırılmıştır.

---

## 9. Müşteri Siparişleri Listeleme Servisi

- API Endpoint: GET /api/orders/my-orders
- Görev: Müşterinin kendi siparişlerini mobil uygulamada listelemek.

### İşlevler

- Kullanıcının kendi siparişlerini API'den çekme
- Siparişleri aktif ve teslim edilenler olarak ayırma
- Sipariş durumlarını renkli badge ile gösterme
- Pull-to-refresh ile listeyi yenileme
- Sipariş yoksa empty state gösterme
  
### Teknik Detaylar

- orderApi.getMyOrders(params) fonksiyonu oluşturulmuştur.
- getOrders(response) helper fonksiyonu kullanılmıştır.
- Siparişler activeOrders ve deliveredOrders olarak gruplanmıştır.
- Sipariş istatistikleri useMemo ile hesaplanmıştır.

---

## 10. QR Masa Servisi

- API Endpoint: GET /api/tables/code/:tableCode
- Görev: QR koddan okunan masa kodunu backend'e göndererek masa bilgisini almak.

### İşlevler

- QR koddan masa kodunu okuma
- QR içeriği link ise içinden masa kodunu ayrıştırma
- Masa koduyla backend'e istek gönderme
- Gelen masa bilgisini seçili masa olarak saklama
- Checkout ekranında masa numarasını otomatik doldurma

### Teknik Detaylar

- tableApi.getTableByCode(tableCode) fonksiyonu oluşturulmuştur.
- extractTableCode() fonksiyonu ile QR içeriğinden masa kodu ayrıştırılmıştır.
- QR içeriği direkt kod veya /table/:tableCode/menu formatında link olabilir.
- getTable(response) helper fonksiyonu kullanılmıştır.
- CartContext içine selectedTable, setSelectedTable ve clearSelectedTable eklenmiştir.

---

## 11. Personel Sipariş Listeleme Servisi

- API Endpoint: GET /api/orders
- Görev: Kitchen, Waiter, Admin ve Owner rolleri için sipariş listesini backend'den çekmek.

### İşlevler

- Kitchen ekranında aktif siparişleri listeleme
- Waiter ekranında hazır siparişleri listeleme
- Duruma göre filtreleme yapma
- Sıralama parametresi gönderme
- Pull-to-refresh ve manuel yenileme desteği sağlama

### Teknik Detaylar

- orderApi.getAllOrders(params) fonksiyonu oluşturulmuştur.
- Kitchen ekranında received, preparing ve ready durumları gösterilmiştir.
- Waiter ekranında sadece ready durumundaki siparişler gösterilmiştir.
- Liste 15 saniyede bir otomatik yenilenmiştir.
- API çağrıları useCallback ile düzenlenmiştir.

---

## 12. Sipariş Durumu Güncelleme Servisi

- API Endpoint: PUT /api/orders/:id/status
- Görev: Kitchen ve Waiter ekranlarında sipariş durumunu güncellemek.

### İşlevler

- Kitchen ekranında siparişi received durumundan preparing durumuna alma
- Kitchen ekranında siparişi preparing durumundan ready durumuna alma
- Waiter ekranında siparişi ready durumundan delivered durumuna alma
- Başarılı güncelleme sonrası listeyi yenileme
- Hata durumunda kullanıcıya mesaj gösterme

### Durum Akışı

Kitchen:
received -> preparing
preparing -> ready

Waiter:
ready -> delivered

### Teknik Detaylar

- orderApi.updateOrderStatus(orderId, orderStatus) fonksiyonu oluşturulmuştur.
- İşlemdeki siparişi takip etmek için updatingOrderId state'i kullanılmıştır.
- Güncelleme sırasında ilgili buton disabled hale getirilmiştir.
- Başarılı işlemden sonra fetchOrders({ silent: true }) çağrılmıştır.

---

## 13. Response Helper Servisleri

- Dosya: mobile/src/api/responseHelpers.js
- Görev: Backend'den gelen farklı response formatlarını mobil ekranlarda kolay kullanılabilir hale getirmek.

### İşlevler

- Auth response'unu ayrıştırma
- Menü ürünlerini ayrıştırma
- Kategori listesini ayrıştırma
- Ürün detayını ayrıştırma
- Sipariş listesini ayrıştırma
- Masa bilgisini ayrıştırma
- 
### Teknik Detaylar

getAuthPayload(response)
getItems(response)
getCategories(response)
getItem(response)
getOrders(response)
getTable(response)

- Bu helper fonksiyonlar sayesinde ekranlarda response formatı tekrar tekrar kontrol edilmemiştir.

---

## 14. Mobil Backend Hata ve Loading Yönetimi

- Görev: API isteklerinde loading, success ve error state yönetimini sağlamak.

### İşlevler

- API isteği sırasında loading indicator gösterme
- Form gönderimi sırasında butonu loading/disabled hale getirme
- API hatalarında kullanıcı dostu mesaj gösterme
- Başarılı işlemlerde başarı mesajı gösterme
- Veri yoksa empty state gösterme

### Teknik Detaylar

- loading
- refreshing
- submitting
- updatingOrderId
- error
- message

- state yapıları ekranlara göre kullanılmıştır.

---

## 15. Rol Bazlı Backend Kullanımı

- Görev: Kullanıcı rolüne göre uygun API akışlarının çalıştırılması.
- Roller
- customer
- kitchen
- waiter
- admin
- owner

### İşlevler

- Customer kullanıcısı müşteri sipariş endpointlerini kullanır.
- Kitchen kullanıcısı mutfak sipariş endpointlerini kullanır.
- Waiter kullanıcısı hazır sipariş endpointlerini kullanır.
- Admin ve Owner rolleri personel ekranlarını görebilir.

### Teknik Detaylar

- Kullanıcı rolü AuthContext içindeki userInfo.user.role üzerinden okunmuştur.
- RootNavigator içinde role based yönlendirme yapılmıştır.
- Personel ekranları için StaffTabs, müşteri ekranları için CustomerTabs kullanılmıştır.

---
