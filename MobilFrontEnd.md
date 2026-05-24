# BaristaOne Mobil Frontend Görev Dağılımı

Bu dokümanda, BaristaOne mobil uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) kapsamında yapılan mobil frontend geliştirmeleri listelenmektedir.

Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir. Uygulama hem müşteri tarafı sipariş akışını hem de personel tarafı mutfak/garson operasyonlarını desteklemektedir.

---

## Grup Üyelerinin Mobil Frontend Görevleri

1. [Kamil Ertap'ın Mobil Frontend Görevleri](Kamil-Ertap/Kamil-Ertap-Mobil-Frontend-Gorevleri.md)

---

## Genel Mobil Frontend Prensipleri

### 1. Tasarım Sistemi

- BaristaOne uygulamasında sıcak kahve tonları temel alınmıştır.
- Ana renk olarak kahverengi / espresso tonu kullanılmıştır.
- Sayfa arka planlarında açık gri ve beyaz tonları tercih edilmiştir.
- Kart yapıları, yuvarlatılmış köşeler ve sade gölgeler kullanılmıştır.
- Butonlar primary, secondary ve danger varyantlarıyla standartlaştırılmıştır.

### 2. Responsive Tasarım

- Uygulama portrait kullanım için hazırlanmıştır.
- ScrollView tabanlı ekran yapıları kullanılarak farklı ekran boyutlarına uyum sağlanmıştır.
- Android cihazlarda alt sistem navigation bar ile çakışmayı önlemek için SafeArea desteği eklenmiştir.
- Bottom tab navigation alanı cihazın alt safe area değerine göre dinamik olarak yükseltilmiştir.

### 3. Kullanıcı Deneyimi (UX)

- Loading ekranları oluşturulmuştur.
- Empty state bileşenleri kullanılmıştır.
- API hatalarında kullanıcı dostu hata mesajları gösterilmiştir.
- Sepet ve QR masa durumları için tab badge sistemi eklenmiştir.
- Sipariş durumları renkli badge yapısıyla daha anlaşılır hale getirilmiştir.
- Kitchen ve Waiter ekranlarında otomatik yenileme desteği eklenmiştir.

### 4. Erişilebilirlik ve Kullanılabilirlik

- Butonlar mobil dokunma alanına uygun boyutlarda tasarlanmıştır.
- Form inputlarında uygun keyboard type değerleri kullanılmıştır.
- Şifre alanlarında secure text entry kullanılmıştır.
- QR ile masa seçildiğinde manuel masa inputu kilitlenerek hatalı masa değişimi önlenmiştir.

### 5. Performans

- Menü arama ve filtreleme işlemlerinde kısa gecikmeli istek yapısı kullanılmıştır.
- Pull-to-refresh desteği ile ekranlar manuel olarak yenilenebilir hale getirilmiştir.
- Personel ekranlarında 15 saniyelik otomatik yenileme sistemi eklenmiştir.
- Gereksiz API çağrılarını azaltmak için filtre state yönetimi kullanılmıştır.

### 6. Navigasyon

- React Navigation kullanılmıştır.
- Müşteri ve personel kullanıcıları için role based navigation sistemi kurulmuştur.
- Customer kullanıcıları müşteri tablarına yönlendirilmiştir.
- Kitchen, Waiter, Admin ve Owner rolleri personel tablarına yönlendirilmiştir.
- Bottom tab navigation kullanılmıştır.
- Menü ekranı için stack navigation yapısı eklenmiştir.

### 7. Form Yönetimi

- Login ve Register ekranlarında boş alan kontrolleri yapılmıştır.
- Checkout ekranında masa numarası kontrolü yapılmıştır.
- QR ile masa seçilirse masa numarası otomatik doldurulmuştur.
- QR ile seçilen masa temizlenirse manuel giriş tekrar aktif hale getirilmiştir.

### 8. Platform Özellikleri

- Expo Camera ile QR kod okutma özelliği eklenmiştir.
- Android kamera izni yapılandırılmıştır.
- App icon, adaptive icon ve favicon dosyaları hazırlanmıştır.
- APK test build alınmış ve fiziksel cihazda açılma sorunu giderilmiştir.
