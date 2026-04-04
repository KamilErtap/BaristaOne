# Kamil Ertap'ın Web Frontend Görevleri

## 1. Üye Olma (Kayıt) Sayfası
- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive kayıt formu
  - Ad input alanı
  - Email input alanı
  - Şifre input alanı
  - "Kayıt Ol" butonu
  - "Zaten hesabın var mı? Giriş yap" linki
  - Hata mesajı gösterim alanı
- **Form Validasyonu:**
  - Tüm alanlar zorunlu
  - Email format kontrolü
  - Şifre alanı boş olamaz kontrolü
- **Kullanıcı Deneyimi:**
  - Başarılı kayıt sonrası otomatik giriş yapılması
  - Başarısız kayıt durumunda kullanıcıya hata mesajı gösterilmesi
  - Formun sade ve anlaşılır olması
- **Teknik Detaylar:**
  - React ile geliştirilmiştir
  - Form state yönetimi yapılır
  - API isteği axios ile gönderilir
  - Başarılı işlem sonrası yönlendirme yapılır

## 2. Giriş Yapma Sayfası
- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Kullanıcı giriş işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive giriş formu
  - Email input alanı
  - Şifre input alanı
  - "Giriş Yap" butonu
  - "Hesabın yok mu? Kayıt ol" linki
  - Hata mesajı gösterim alanı
- **Form Validasyonu:**
  - Email ve şifre alanları zorunlu
  - Email format kontrolü
- **Kullanıcı Deneyimi:**
  - Başarılı giriş sonrası kullanıcı rolüne göre yönlendirme
  - Hatalı girişte kullanıcıya anlaşılır hata mesajı gösterilmesi
- **Teknik Detaylar:**
  - React ile geliştirilmiştir
  - AuthContext ile kullanıcı bilgisi yönetilir
  - Token localStorage içinde tutulur
  - API isteği axios ile yapılır

## 3. Menü Görüntüleme Sayfası
- **API Endpoint:** `GET /api/menu`
- **Görev:** Kullanıcıların menüyü görüntüleyebileceği ana sayfanın tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Menü ürün kartları
  - Ürün adı, açıklama, fiyat ve kategori bilgileri
  - Ürün görseli
  - "Sepete Ekle" butonu
  - Arama kutusu
  - Kategori filtreleme alanı
  - Sıralama seçeneği
- **Kullanıcı Deneyimi:**
  - Menü ürünlerinin kart yapısında gösterilmesi
  - Kullanıcıların ürünleri kolayca filtreleyebilmesi
  - Mobil ve masaüstü uyumlu görünüm
- **Teknik Detaylar:**
  - Veriler backend'den axios ile çekilir
  - React state ile filtreleme ve sıralama yönetilir
  - Bileşen bazlı yapı kullanılır

## 4. Menü Kategorilerini Görüntüleme
- **API Endpoint:** `GET /api/menu/categories`
- **Görev:** Menüde bulunan kategorilerin frontend tarafında filtreleme için listelenmesi
- **UI Bileşenleri:**
  - Kategori dropdown alanı
  - Varsayılan "Tüm Kategoriler" seçeneği
- **Kullanıcı Deneyimi:**
  - Kullanıcı ürünleri kategoriye göre hızlıca filtreleyebilir
- **Teknik Detaylar:**
  - Kategoriler backend’den çekilir
  - Menü sayfasındaki filtre alanına bağlanır

## 5. Tek Bir Menü Ürününü Görüntüleme
- **API Endpoint:** `GET /api/menu/{urunId}`
- **Görev:** Belirli bir ürünün detay bilgisini görüntüleme altyapısını sağlamak
- **UI Bileşenleri:**
  - Ürün detay alanı
  - Ürün adı, açıklama, fiyat, kategori ve görsel bilgisi
- **Kullanıcı Deneyimi:**
  - Kullanıcı seçilen ürün hakkında detaylı bilgi görebilir
- **Teknik Detaylar:**
  - Dinamik route mantığına uygun yapı kurulabilir
  - API’den ürün id ile veri çekilir

## 6. Menüye Ürün Ekleme Sayfası
- **API Endpoint:** `POST /api/menu`
- **Görev:** Admin kullanıcısının menüye yeni ürün ekleyebileceği form sayfasının tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Ürün adı input alanı
  - Açıklama input alanı
  - Fiyat input alanı
  - Kategori input alanı
  - Görsel URL input alanı
  - Mevcutluk checkbox alanı
  - "Ekle" butonu
- **Kullanıcı Deneyimi:**
  - Admin yeni ürünleri kolayca sisteme ekleyebilir
  - Başarılı işlem sonrası liste güncellenir
- **Teknik Detaylar:**
  - Sadece admin kullanıcı erişebilir
  - API isteğinde Authorization header kullanılır
  - Form state React ile yönetilir

## 7. Menü Ürünü Güncelleme Sayfası
- **API Endpoint:** `PUT /api/menu/{urunId}`
- **Görev:** Admin kullanıcısının mevcut menü ürününü güncelleyebileceği düzenleme akışının implementasyonu
- **UI Bileşenleri:**
  - Önceden dolu form alanları
  - "Güncelle" butonu
  - "İptal" butonu
- **Kullanıcı Deneyimi:**
  - Admin seçtiği ürünü düzenleyebilir
  - Düzenleme sonrası ürün listesi yenilenir
- **Teknik Detaylar:**
  - Ürün bilgileri forma aktarılır
  - Güncelleme isteği axios ile gönderilir
  - Sadece admin erişimi sağlanır

## 8. Menüden Ürün Silme Akışı
- **API Endpoint:** `DELETE /api/menu/{urunId}`
- **Görev:** Admin kullanıcısının menüdeki bir ürünü silebilmesi için gerekli UI akışının tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - "Sil" butonu
  - Onay mesajı veya confirmation dialog
- **Kullanıcı Deneyimi:**
  - Yanlışlıkla silmeyi önlemek için onay istenir
  - Başarılı silme sonrası liste güncellenir
- **Teknik Detaylar:**
  - Silme isteği axios ile yapılır
  - Sadece admin kullanıcılara açıktır

## 9. Sipariş Verme Sayfası
- **API Endpoint:** `POST /api/orders`
- **Görev:** Kullanıcının menüden seçtiği ürünlerle sipariş oluşturmasını sağlayan arayüzün tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Sepet alanı
  - Sepete ürün ekleme butonu
  - Ürün adet artırma ve azaltma butonları
  - Masa numarası input alanı
  - Toplam fiyat gösterimi
  - "Siparişi Oluştur" butonu
- **Kullanıcı Deneyimi:**
  - Kullanıcı ürünleri sepete ekleyebilir
  - Masa numarası girerek sipariş oluşturabilir
  - Başarılı sipariş sonrası sepet temizlenir
- **Teknik Detaylar:**
  - Sipariş verileri frontend’de state ile tutulur
  - API isteği axios ile gönderilir
  - Yalnızca giriş yapmış customer rolündeki kullanıcı sipariş verebilir

## 10. Kendi Siparişlerini Görüntüleme Sayfası
- **API Endpoint:** `GET /api/orders/my-orders`
- **Görev:** Giriş yapan kullanıcının kendi siparişlerini görüntüleyebileceği sayfanın tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Sipariş kartları
  - Sipariş numarası
  - Masa numarası
  - Sipariş durumu
  - Toplam fiyat
  - Sipariş tarih bilgisi
  - Sipariş ürünleri listesi
  - Filtreleme ve sıralama alanları
- **Kullanıcı Deneyimi:**
  - Kullanıcı geçmiş siparişlerini görebilir
  - Sipariş durumunu takip edebilir
- **Teknik Detaylar:**
  - Veriler backend’den çekilir
  - Query parametreleri ile filtreleme yapılabilir
  - Sayfa sadece giriş yapan kullanıcıya açıktır

## 11. Tüm Siparişleri Görüntüleme Sayfası
- **API Endpoint:** `GET /api/orders`
- **Görev:** Admin kullanıcısının tüm siparişleri görüntüleyebileceği yönetim sayfasının tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Sipariş listesi
  - Müşteri adı ve email bilgisi
  - Masa numarası
  - Sipariş durumu
  - Toplam fiyat
  - Sipariş ürünleri listesi
  - Filtreleme ve sıralama alanları
- **Kullanıcı Deneyimi:**
  - Admin tüm siparişleri takip edebilir
  - Sipariş yoğunluğunu yönetebilir
- **Teknik Detaylar:**
  - Sayfa yalnızca admin erişimine açıktır
  - Axios ile veri çekilir
  - Role-based route koruması uygulanır

## 12. Sipariş Durumu Güncelleme Sayfası
- **API Endpoint:** `PUT /api/orders/{orderId}/status`
- **Görev:** Admin kullanıcısının sipariş durumunu güncelleyebilmesini sağlayan arayüzün implementasyonu
- **UI Bileşenleri:**
  - "Alındı" butonu
  - "Hazırlanıyor" butonu
  - "Hazır" butonu
  - "Teslim Edildi" butonu
- **Kullanıcı Deneyimi:**
  - Admin siparişlerin durumunu hızlıca değiştirebilir
  - Değişiklik sonrası sipariş listesi güncellenir
- **Teknik Detaylar:**
  - Güncelleme isteği axios ile yapılır
  - Admin yetkisi gerekir
  - Güncelleme sonrası veriler tekrar çekilir

## 13. Ortak Frontend Altyapısı
- **Görev:** Uygulamanın genel frontend altyapısının tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Navbar
  - Protected route yapısı
  - Admin route koruması
  - Ortak sayfa düzenleri
- **Kullanıcı Deneyimi:**
  - Kullanıcı rolüne göre uygun menülerin gösterilmesi
  - Yetkisiz kullanıcının korumalı sayfalara erişememesi
- **Teknik Detaylar:**
  - React Router kullanılır
  - AuthContext ile kullanıcı oturumu yönetilir
  - Token localStorage üzerinde tutulur
  - Axios interceptor ile Authorization header otomatik eklenir