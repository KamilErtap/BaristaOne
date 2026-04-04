## API İşlevleri

1. **Üye Olma** (Kamil Ertap)  
   - **API Metodu:** `POST /api/auth/register`  
   - **Açıklama:** Yeni kullanıcıların sisteme kayıt olmasını sağlar. Kullanıcılar ad, email adresi ve şifre bilgileriyle hesap oluşturabilir.

2. **Giriş Yapma** (Kamil Ertap)  
   - **API Metodu:** `POST /api/auth/login`  
   - **Açıklama:** Kullanıcıların sisteme giriş yapmasını sağlar. Email adresi ve şifre ile kimlik doğrulama yapılır. Giriş başarılı olduğunda kullanıcıya yetkilendirme işlemlerinde kullanılmak üzere erişim bilgisi döndürülür.

3. **Kullanıcı Bilgilerini Görüntüleme** (Kamil Ertap)  
   - **API Metodu:** `GET /api/auth/me`  
   - **Açıklama:** Giriş yapmış kullanıcının kendi hesap bilgilerini görüntülemesini sağlar.

4. **Menüyü Görüntüleme** (Kamil Ertap)  
   - **API Metodu:** `GET /api/menu`  
   - **Açıklama:** Kullanıcıların sistemde kayıtlı menü ürünlerini görüntülemesini sağlar. Ürünler kategori, fiyat, açıklama ve görsel bilgileriyle birlikte listelenir.

5. **Menü Kategorilerini Görüntüleme** (Kamil Ertap)  
   - **API Metodu:** `GET /api/menu/categories`  
   - **Açıklama:** Menüde yer alan ürün kategorilerini liste halinde görüntülemeyi sağlar.

6. **Tek Bir Menü Ürününü Görüntüleme** (Kamil Ertap)  
   - **API Metodu:** `GET /api/menu/{urunId}`  
   - **Açıklama:** Belirli bir menü ürününün detaylı bilgilerini görüntülemeyi sağlar.

7. **Menüye Ürün Ekleme** (Kamil Ertap)  
   - **API Metodu:** `POST /api/menu`  
   - **Açıklama:** Admin kullanıcısının menüye yeni ürün eklemesini sağlar. Ürün adı, açıklama, fiyat, kategori ve görsel bilgisi eklenebilir.

8. **Menü Ürünü Güncelleme** (Kamil Ertap)  
   - **API Metodu:** `PUT /api/menu/{urunId}`  
   - **Açıklama:** Admin kullanıcısının menüde bulunan bir ürünü güncellemesini sağlar. Ürün bilgileri, fiyatı, kategorisi, görseli veya mevcut olup olmadığı durumu değiştirilebilir.

9. **Menüden Ürün Silme** (Kamil Ertap)  
   - **API Metodu:** `DELETE /api/menu/{urunId}`  
   - **Açıklama:** Admin kullanıcısının menüde yer alan bir ürünü silmesini sağlar.

10. **Sipariş Verme** (Kamil Ertap)  
    - **API Metodu:** `POST /api/orders`  
    - **Açıklama:** Kullanıcıların seçtikleri ürünlerle sipariş oluşturmasını sağlar. Sipariş oluşturulurken masa numarası girilir ve siparişin oluşabilmesi için ödeme durumunun yapılmış olması gerekir.

11. **Kullanıcının Kendi Siparişlerini Görüntülemesi** (Kamil Ertap)  
    - **API Metodu:** `GET /api/orders/my-orders`  
    - **Açıklama:** Giriş yapmış kullanıcının kendi siparişlerini liste halinde görüntülemesini sağlar. Sipariş durumu, masa numarası ve toplam tutar gibi bilgiler gösterilir.

12. **Tüm Siparişleri Görüntüleme** (Kamil Ertap)  
    - **API Metodu:** `GET /api/orders`  
    - **Açıklama:** Admin kullanıcısının sistemde oluşturulmuş tüm siparişleri liste halinde görüntülemesini sağlar.

13. **Sipariş Durumu Güncelleme** (Kamil Ertap)  
    - **API Metodu:** `PUT /api/orders/{orderId}/status`  
    - **Açıklama:** Admin kullanıcısının sipariş durumunu güncellemesini sağlar. Sipariş durumu alınan, hazırlanıyor, hazır veya teslim edildi gibi aşamalara geçirilebilir.