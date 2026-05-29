# Kamil Ertap'ın Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** [Link buraya eklenecek](https://example.com)

Bu dokümanda BaristaOne mobil uygulaması için geliştirilen müşteri ve personel ekranları açıklanmaktadır. Mobil uygulama React Native ve Expo ile geliştirilmiştir.

---

## 1. Giriş Yapma Ekranı

- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Kullanıcının email ve şifre bilgileriyle mobil uygulamaya giriş yapmasını sağlayan ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Email input alanı
- Şifre input alanı
- "Giriş Yap" butonu
- "Hesabın yok mu? Kayıt ol" butonu
- Loading indicator
- Hata mesajı alanı
- BaristaOne marka başlığı

### Form Validasyonu

- Email alanı boş bırakılamaz.
- Şifre alanı boş bırakılamaz.
- Eksik alan varsa kullanıcıya hata mesajı gösterilir.
- API hatası durumunda kullanıcı dostu mesaj gösterilir.

### Kullanıcı Deneyimi

- Giriş işlemi sırasında loading durumu gösterilir.
- Başarılı giriş sonrası kullanıcı rolüne göre ilgili mobil arayüze yönlendirilir.
- Customer rolündeki kullanıcı müşteri ekranlarına yönlendirilir.
- Kitchen, Waiter, Admin ve Owner rolleri personel ekranlarına yönlendirilir.
- Token AsyncStorage üzerinde saklanır.
- Uygulama tekrar açıldığında oturum korunur.

### Teknik Detaylar

- `AuthContext` kullanılmıştır.
- `AsyncStorage` ile token saklama yapılmıştır.
- Axios interceptor ile Authorization header otomatik eklenmiştir.
- `authApi.login()` servisi kullanılmıştır.
- React Navigation ile ekran geçişi yapılmıştır.

---

## 2. Kayıt Olma Ekranı

- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Yeni müşteri hesabı oluşturmak için mobil kayıt ekranının tasarımı ve implementasyonu.

### UI Bileşenleri

- Ad soyad input alanı
- Email input alanı
- Şifre input alanı
- "Kayıt Ol" butonu
- "Zaten hesabın var mı? Giriş yap" butonu
- Loading indicator
- Hata mesajı alanı

### Form Validasyonu

- Ad soyad alanı boş bırakılamaz.
- Email alanı boş bırakılamaz.
- Şifre alanı boş bırakılamaz.
- Eksik alan varsa kullanıcıya hata mesajı gösterilir.
- API hata mesajı kullanıcıya gösterilir.

### Kullanıcı Deneyimi

- Kayıt işlemi sırasında loading durumu gösterilir.
- Başarılı kayıt sonrası kullanıcı otomatik olarak giriş yapmış kabul edilir.
- Kullanıcı müşteri ana ekranına yönlendirilir.
- Klavye açıldığında ekran içeriğinin kaybolmaması için KeyboardAvoidingView kullanılmıştır.

### Teknik Detaylar

- `authApi.register()` servisi kullanılmıştır.
- `AuthContext` içindeki login fonksiyonu ile kayıt sonrası oturum açılmıştır.
- Form state yönetimi `useState` ile yapılmıştır.
- React Navigation ile Login ekranına dönüş sağlanmıştır.

---

## 3. Menü Listeleme Ekranı

- **API Endpoint:** `GET /api/menu`
- **Görev:** Kafe menüsündeki ürünleri mobil cihazda listeleyen ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Menü başlığı
- Kullanıcı karşılama metni
- Ürün kartları
- Ürün görseli
- Ürün adı
- Ürün açıklaması
- Ürün fiyatı
- Kategori badge
- Müsait / Tükendi badge
- Pull-to-refresh
- Empty state
- Loading state

### Kullanıcı Deneyimi

- Menü yüklenirken loading ekranı gösterilir.
- Ürün yoksa bilgilendirici boş durum mesajı gösterilir.
- API hatası durumunda hata mesajı gösterilir.
- Ürüne basıldığında ürün detay ekranına gidilir.
- Liste pull-to-refresh ile yenilenebilir.

### Teknik Detaylar

- `menuApi.getMenuItems()` servisi kullanılmıştır.
- API response verisi `getItems()` helper fonksiyonu ile ayrıştırılmıştır.
- Ürün kartları Card bileşeni ile gösterilmiştir.
- Navigation ile `MenuDetail` ekranına geçiş yapılmıştır.

---

## 4. Menü Arama, Kategori ve Sıralama Özellikleri

- **API Endpoint:** `GET /api/menu`
- **Görev:** Mobil menü ekranında ürün arama, kategori filtreleme ve sıralama özelliklerinin implementasyonu.

### UI Bileşenleri

- Ürün arama inputu
- Kategori chipleri
- Sıralama chipleri
- "Filtreleri Temizle" butonu
- Aktif filtre görünümü

### Form / Filtre Validasyonu

- Arama değeri boş olabilir.
- Kategori seçimi opsiyoneldir.
- Sıralama seçimi opsiyoneldir.
- Filtreler temizlenince liste varsayılan hale döner.

### Kullanıcı Deneyimi

- Arama işlemi kısa gecikmeyle çalışır.
- Kullanıcı her harfte agresif API isteği göndermeden ürün arayabilir.
- Kategori chipleri yatay scroll ile gösterilir.
- Sıralama seçenekleri mobil kullanıma uygun chip yapısıyla sunulur.

### Teknik Detaylar

- `filters` state yapısı kullanılmıştır.
- `search`, `category`, `sort` parametreleri API’ye gönderilmiştir.
- `getCategories()` helper fonksiyonu ile kategori verisi ayrıştırılmıştır.
- `setTimeout` ile 350ms gecikmeli arama yapılmıştır.

---

## 5. Ürün Detay Ekranı

- **API Endpoint:** `GET /api/menu/:id`
- **Görev:** Seçilen ürünün detaylarını gösteren ve sepete ekleme işlemini sağlayan ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Ürün görseli
- Ürün adı
- Ürün açıklaması
- Ürün fiyatı
- Kategori badge
- Müsait / Tükendi badge
- Adet artırma butonu
- Adet azaltma butonu
- Ara toplam bilgisi
- "Sepete Ekle" butonu
- Geri dön butonu

### Form Validasyonu

- Adet değeri minimum 1 olabilir.
- Ürün müsait değilse sepete ekleme engellenir.
- Ürün bulunamazsa empty state gösterilir.

### Kullanıcı Deneyimi

- Ürün sepete eklendiğinde bilgilendirme mesajı gösterilir.
- Sepete ekleme sonrası kullanıcı sepet ekranına yönlendirilir.
- Tükendi durumundaki ürünler için buton disabled hale gelir.

### Teknik Detaylar

- `menuApi.getMenuItemById()` servisi kullanılmıştır.
- `CartContext` içindeki `addToCart()` fonksiyonu kullanılmıştır.
- Navigation params ile ürün id bilgisi taşınmıştır.

---

## 6. Sepet Ekranı

- **Görev:** Kullanıcının sepete eklediği ürünleri görüntüleyip yönetebildiği ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Sepet başlığı
- Sepetteki ürün kartları
- Ürün görseli
- Ürün adı
- Ürün kategorisi
- Ürün fiyatı
- Adet artırma butonu
- Adet azaltma butonu
- Ürün silme butonu
- Sepeti temizleme butonu
- Toplam ürün sayısı
- Toplam tutar
- Checkout’a git butonu
- Boş sepet empty state

### Form Validasyonu

- Ürün adedi 0 olduğunda ürün sepetten kaldırılır.
- Sepet boşsa checkout yönlendirmesi yerine kullanıcı menüye yönlendirilir.

### Kullanıcı Deneyimi

- Sepet boşken kullanıcıya menüye gitme butonu sunulur.
- Sepet tabında ürün sayısı badge olarak gösterilir.
- Adet artırma ve azaltma işlemleri anında UI’a yansır.
- Sepeti temizleme işlemi tek butonla yapılır.

### Teknik Detaylar

- `CartContext` oluşturulmuştur.
- `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart`, `clearCart` fonksiyonları yazılmıştır.
- `totalItems` ve `totalPrice` değerleri `useMemo` ile hesaplanmıştır.

---

## 7. Checkout / Ödeme Ekranı

- **API Endpoint:** `POST /api/orders`
- **Görev:** Sepetteki ürünleri masa numarasıyla birlikte siparişe dönüştüren ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Masa numarası input alanı
- QR ile seçili masa bilgi kutusu
- QR Masa’ya git butonu
- Ödeme simülasyon bilgi kutusu
- Sipariş özeti
- Toplam ürün sayısı
- Toplam tutar
- "Siparişi Tamamla" butonu
- Sepete dön butonu
- Boş sepet empty state

### Form Validasyonu

- Sepet boşsa sipariş oluşturulamaz.
- Masa numarası boşsa kullanıcıya uyarı gösterilir.
- Masa QR ile seçilmişse input kilitlenir.
- Masa seçimi temizlenirse manuel input tekrar açılır.

### Kullanıcı Deneyimi

- Sepet boşken kullanıcı menüye veya siparişlerim ekranına yönlendirilir.
- QR ile masa seçilmemişse kullanıcıya QR Masa’ya git önerisi gösterilir.
- Sipariş başarılı olunca sepet temizlenir.
- Sipariş başarılı olunca kullanıcı Siparişlerim ekranına yönlendirilir.

### Teknik Detaylar

- `orderApi.createOrder()` servisi kullanılmıştır.
- Mobil sepet verisi backend’in beklediği `items` formatına dönüştürülmüştür.
- Payload içinde `paymentStatus: "paid"` gönderilerek ödeme simülasyonu yapılmıştır.
- `CartContext` üzerinden sepet ve seçili masa bilgisi alınmıştır.

---

## 8. QR Masa Okutma Ekranı

- **API Endpoint:** `GET /api/tables/code/:tableCode`
- **Görev:** Masadaki QR kodu okutarak masa bilgisini otomatik seçen ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Kamera görüntüsü
- QR okutma alanı
- Kamera izni butonu
- Tekrar tara butonu
- Menüye git butonu
- Seçili masa bilgi kartı
- Masa seçimini temizleme butonu
- Başarı ve hata mesajları

### Validasyon

- Kamera izni yoksa izin isteme ekranı gösterilir.
- QR içinden masa kodu okunamazsa hata mesajı gösterilir.
- Geçersiz masa kodu için kullanıcı dostu hata mesajı gösterilir.
- QR direkt masa kodu veya web linki olarak okunabilir.

### Kullanıcı Deneyimi

- QR okutulunca masa bilgisi otomatik seçilir.
- QR Masa tabında seçili masa için ✓ badge gösterilir.
- Checkout ekranında masa numarası otomatik doldurulur.
- QR ile seçilen masa manuel olarak değiştirilemez.
- Kullanıcı isterse masa seçimini temizleyebilir.

### Teknik Detaylar

- `expo-camera` kullanılmıştır.
- `CameraView` ile QR okutma yapılmıştır.
- QR içeriğinden masa kodu ayrıştıran `extractTableCode()` fonksiyonu yazılmıştır.
- `tableApi.getTableByCode()` servisi kullanılmıştır.
- `CartContext` içinde `selectedTable`, `setSelectedTable`, `clearSelectedTable` state yapısı oluşturulmuştur.

---

## 9. Siparişlerim Ekranı

- **API Endpoint:** `GET /api/orders/my-orders`
- **Görev:** Müşterinin kendi siparişlerini görüntülediği ve sipariş durumunu takip ettiği ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Siparişlerim başlığı
- Yenile butonu
- Pull-to-refresh
- Toplam / aktif / hazır / teslim istatistik kartları
- Aktif siparişler listesi
- Teslim edilen siparişler listesi
- Sipariş kartı
- Masa numarası
- Sipariş numarası
- Ürün listesi
- Toplam tutar
- Renkli sipariş durumu badge
- Ödeme durumu badge
- Boş sipariş empty state
- Menüye git butonu

### Kullanıcı Deneyimi

- Siparişler aktif ve teslim edilenler olarak ayrılmıştır.
- Duruma göre farklı renklerde badge gösterilmiştir.
- Sipariş durumu açıklayıcı mesajlarla gösterilmiştir.
- Pull-to-refresh ve Yenile butonu ile liste güncellenebilir.
- Sipariş yoksa kullanıcı menüye yönlendirilir.

### Teknik Detaylar

- `orderApi.getMyOrders()` servisi kullanılmıştır.
- `getOrders()` helper fonksiyonu ile API response ayrıştırılmıştır.
- Siparişler `activeOrders` ve `deliveredOrders` olarak gruplanmıştır.
- Sipariş durumları için label ve renk mapping yapısı oluşturulmuştur.

---

## 10. Role Based Navigation

- **Görev:** Kullanıcı rolüne göre mobil uygulamada uygun ekranların gösterilmesi.

### Roller

- `customer`
- `kitchen`
- `waiter`
- `admin`
- `owner`

### Kullanıcı Deneyimi

- Customer rolü müşteri tablarına yönlendirilir.
- Kitchen rolü mutfak ekranına yönlendirilir.
- Waiter rolü garson ekranına yönlendirilir.
- Admin ve Owner rolleri personel ekranlarını görebilir.
- Yetkisiz ekranların yanlış kullanıcıya gösterilmesi engellenir.

### Teknik Detaylar

- `RootNavigator` içinde role kontrolü yapılmıştır.
- Customer kullanıcıları için `CustomerTabs` kullanılmıştır.
- Personel kullanıcıları için `StaffTabs` kullanılmıştır.
- `AuthContext` içindeki `userInfo.user.role` değeri kullanılmıştır.

---

## 11. Kitchen / Mutfak Ekranı

- **API Endpoint:** `GET /api/orders`
- **API Endpoint:** `PUT /api/orders/:id/status`
- **Görev:** Mutfak personelinin aktif siparişleri görmesini ve sipariş durumlarını güncellemesini sağlayan ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Mutfak başlığı
- Yenile butonu
- Çıkış butonu
- Aktif sipariş istatistikleri
- Durum filtresi
- Sipariş kartları
- Müşteri bilgisi
- Ürün listesi
- Sipariş durumu badge
- "Hazırlanıyor" butonu
- "Hazır" butonu
- Empty state
- Pull-to-refresh

### Validasyon

- Sadece aktif siparişler listelenir.
- Teslim edilmiş siparişler mutfak ekranında gösterilmez.
- `received` durumundaki siparişler `preparing` yapılabilir.
- `preparing` durumundaki siparişler `ready` yapılabilir.
- `ready` durumundaki siparişler için garsona yönlendirme mesajı gösterilir.

### Kullanıcı Deneyimi

- Liste 15 saniyede bir otomatik yenilenir.
- Kullanıcı isterse manuel Yenile butonuyla listeyi güncelleyebilir.
- Durum güncelleme sırasında buton disabled hale gelir.
- İşlem başarılı veya başarısız olursa mesaj gösterilir.

### Teknik Detaylar

- `orderApi.getAllOrders()` servisi kullanılmıştır.
- `orderApi.updateOrderStatus()` servisi kullanılmıştır.
- `useCallback` ile fetch fonksiyonu optimize edilmiştir.
- `setInterval` ile 15 saniyelik otomatik yenileme yapılmıştır.
- Pull-to-refresh desteği eklenmiştir.

---

## 12. Waiter / Garson Ekranı

- **API Endpoint:** `GET /api/orders`
- **API Endpoint:** `PUT /api/orders/:id/status`
- **Görev:** Garson personelinin hazır siparişleri görmesini ve teslim edildi olarak işaretlemesini sağlayan ekranın tasarımı ve implementasyonu.

### UI Bileşenleri

- Garson başlığı
- Yenile butonu
- Çıkış butonu
- Hazır sipariş istatistikleri
- Hazır sipariş kartları
- Masa numarası
- Müşteri bilgisi
- Teslim edilecek ürünler
- Toplam tutar
- "Teslim Edildi" butonu
- Empty state
- Pull-to-refresh

### Validasyon

- Sadece `ready` durumundaki siparişler listelenir.
- Teslim edilen sipariş listeden kaldırılır.
- İşlem sırasında buton disabled hale gelir.

### Kullanıcı Deneyimi

- Hazır siparişler 15 saniyede bir otomatik yenilenir.
- Kullanıcı manuel Yenile butonuyla listeyi güncelleyebilir.
- Sipariş teslim edildiğinde başarı mesajı gösterilir.
- Hazır sipariş yoksa bilgilendirici empty state gösterilir.

### Teknik Detaylar

- `orderApi.getAllOrders({ status: "ready" })` kullanılmıştır.
- `orderApi.updateOrderStatus(orderId, "delivered")` kullanılmıştır.
- `setInterval` ile otomatik yenileme yapılmıştır.
- Pull-to-refresh desteği eklenmiştir.

---

## 13. Mobil App Icon, Splash ve APK Hazırlığı

- **Görev:** Mobil uygulamanın build öncesi görsel asset ve APK hazırlıklarının yapılması.

### UI / Asset Bileşenleri

- `icon.png`
- `adaptive-icon.png`
- `favicon.png`
- `splash-icon.png`

### Kullanıcı Deneyimi

- Uygulama adı BaristaOne olarak ayarlanmıştır.
- Android uygulama ikonları hazırlanmıştır.
- Uygulama açılışta fiziksel cihaz üzerinde test edilmiştir.
- Alt tabların Android sistem navigation bar ile çakışması giderilmiştir.

### Teknik Detaylar

- `app.json` içinde uygulama adı, Android package ve kamera izni yapılandırılmıştır.
- APK build sırasında Expo paket sürüm uyumsuzluğu giderilmiştir.
- `expo-font` ve Expo native paketleri SDK uyumlu sürümlere çekilmiştir.
- `SafeAreaProvider` eklenmiştir.
- Bottom tab yüksekliği `useSafeAreaInsets()` ile dinamik hale getirilmiştir.
