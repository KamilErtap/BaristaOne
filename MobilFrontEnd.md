# BaristaOne Mobil Frontend Görev Dağılımı

Bu dokümanda, BaristaOne mobil uygulamasının kullanıcı arayüzü ve kullanıcı deneyimi görevleri listelenmektedir. Mobil uygulama React Native ve Expo kullanılarak geliştirilmiştir.

---

## Grup Üyelerinin Mobil Frontend Görevleri

1. [Kamil Ertap'ın Mobil Frontend Görevleri](Kamil-Ertap/Kamil-Ertap-Mobil-Frontend-Gorevleri.md)
   
---

## Mobil Frontend Kapsamı

BaristaOne mobil uygulaması iki ana kullanıcı grubunu desteklemektedir:

1. Müşteri
2. Personel

---

## Müşteri Mobil Ekranları

- Login Screen
- Register Screen
- Menü Screen
- Ürün Detay Screen
- Sepet Screen
- Checkout / Ödeme Screen
- Siparişlerim Screen
- QR Masa Screen

---

## Personel Mobil Ekranları

- Kitchen / Mutfak Screen
- Waiter / Garson Screen
- Role Based Navigation
- Sipariş Durum Güncelleme
- Otomatik Yenileme

---

## Genel Mobil Frontend Prensipleri

### 1. Tasarım Sistemi

- BaristaOne ana rengi olarak kahve tonları kullanılmıştır.
- Primary renk: kahverengi / espresso tonu
- Arka planlarda açık gri ve beyaz tonları tercih edilmiştir.
- Kart yapıları, yuvarlatılmış köşeler ve sade gölgeler kullanılmıştır.

### 2. Responsive Tasarım

- Uygulama portrait kullanım için hazırlanmıştır.
- Android cihazlarda alt navigation bar çakışmasını önlemek için safe area desteği eklenmiştir.
- Farklı ekran boyutlarında scroll tabanlı sayfa yapısı kullanılmıştır.

### 3. Kullanıcı Deneyimi

- Loading ekranları eklendi.
- Empty state bileşenleri oluşturuldu.
- API hatalarında kullanıcı dostu hata mesajları gösterildi.
- Sepet ve QR masa durumları için tab badge kullanıldı.

### 4. Navigasyon

- React Navigation kullanıldı.
- Customer ve Staff kullanıcıları için role based navigation yapısı kuruldu.
- Customer için bottom tab yapısı oluşturuldu.
- Staff için Kitchen / Waiter ekranlarına göre tab yapısı oluşturuldu.

### 5. Form Yönetimi

- Login ve Register ekranlarında boş alan kontrolleri yapıldı.
- Checkout ekranında masa numarası kontrolü yapıldı.
- QR ile masa seçildiğinde manuel masa inputu kilitlendi.
- Masa seçimi temizlenince manuel giriş tekrar açıldı.

### 6. Platform Özellikleri

- Expo Camera ile QR masa okutma özelliği eklendi.
- Android kamera izni yapılandırıldı.
- APK test build alınarak uygulamanın fiziksel cihazda açılması sağlandı.

