import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-body">
          <h1 className="page-title">Gizlilik Politikası</h1>

          <p className="page-subtitle">
            Son güncelleme tarihi: 29 Mayıs 2026
          </p>

          <p>
            BaristaOne, kafe ve restoranlarda QR masa üzerinden sipariş
            oluşturmayı ve sipariş süreçlerini takip etmeyi sağlayan bir
            uygulamadır. Bu gizlilik politikası, BaristaOne mobil ve web
            uygulamalarında hangi bilgilerin işlendiğini ve bu bilgilerin hangi
            amaçlarla kullanıldığını açıklar.
          </p>

          <h2>1. Toplanan Bilgiler</h2>

          <p>
            BaristaOne kullanıcı hesabı oluşturma, giriş yapma ve sipariş
            işlemleri sırasında bazı bilgileri işler.
          </p>

          <ul>
            <li>Ad soyad</li>
            <li>E-posta adresi</li>
            <li>Kullanıcı rolü</li>
            <li>Sipariş bilgileri</li>
            <li>Masa numarası ve QR masa bilgisi</li>
          </ul>

          <h2>2. Bilgilerin Kullanım Amacı</h2>

          <p>
            Toplanan bilgiler aşağıdaki amaçlarla kullanılır:
          </p>

          <ul>
            <li>Kullanıcı hesabı oluşturmak ve oturum açmayı sağlamak</li>
            <li>Menü ürünlerini kullanıcıya göstermek</li>
            <li>Sipariş oluşturmak ve sipariş durumunu takip etmek</li>
            <li>Mutfak ve garson personelinin sipariş süreçlerini yönetmesini sağlamak</li>
            <li>QR masa okutma özelliği ile siparişi ilgili masaya bağlamak</li>
          </ul>

          <h2>3. Kamera Kullanımı</h2>

          <p>
            BaristaOne mobil uygulaması, masadaki QR kodu okutmak için kamera
            izni ister. Kamera yalnızca QR masa kodunu okumak için kullanılır.
            Kamera görüntüsü uygulama tarafından saklanmaz veya üçüncü kişilerle
            paylaşılmaz.
          </p>

          <h2>4. Verilerin Saklanması</h2>

          <p>
            Kullanıcı ve sipariş verileri uygulamanın backend sistemi ve bağlı
            veritabanı üzerinde saklanır. Mobil uygulama tarafında oturum
            bilgisinin korunması için kullanıcı token bilgisi cihaz üzerinde
            saklanabilir.
          </p>

          <h2>5. Verilerin Paylaşılması</h2>

          <p>
            BaristaOne, kullanıcı verilerini reklam amaçlı üçüncü taraflarla
            paylaşmaz. Veriler yalnızca uygulamanın temel sipariş, kullanıcı
            yönetimi ve personel operasyonları için kullanılır.
          </p>

          <h2>6. Veri Güvenliği</h2>

          <p>
            BaristaOne, kullanıcı bilgilerinin güvenliğini korumak için HTTPS
            bağlantısı, kimlik doğrulama ve yetkilendirme kontrolleri gibi
            teknik önlemler kullanır.
          </p>

          <h2>7. Kullanıcı Hakları</h2>

          <p>
            Kullanıcılar hesapları ve uygulamada işlenen bilgileri hakkında
            bilgi talep edebilir. Gerekli durumlarda hesap bilgilerinin
            güncellenmesi veya silinmesi için uygulama yöneticisiyle iletişime
            geçilebilir.
          </p>

          <h2>8. Çocuklara Yönelik Kullanım</h2>

          <p>
            BaristaOne çocuklara yönelik olarak tasarlanmamıştır. Uygulama,
            kafe ve restoran sipariş süreçleri için geliştirilmiştir.
          </p>

          <h2>9. Değişiklikler</h2>

          <p>
            Bu gizlilik politikası zaman zaman güncellenebilir. Güncellemeler
            bu sayfa üzerinden yayınlanır.
          </p>

          <h2>10. İletişim</h2>

          <p>
            Gizlilik politikası hakkında sorular için uygulama geliştiricisiyle
            iletişime geçilebilir.
          </p>

          <p>
            <strong>Geliştirici:</strong> Kamil Ertap
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;