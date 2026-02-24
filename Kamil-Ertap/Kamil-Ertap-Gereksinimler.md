1. **Giriş Yapma** (Kamil Ertap)
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcıların sisteme giriş yaparak hizmetlere erişmesini sağlar. Email adresi ve şifre ile kimlik doğrulama yapılır. Başarılı giriş sonrası kullanıcıya erişim izni verilir ve kişisel verilerin güvenliği sağlanır.

2. **Üye Olma** (Kamil Ertap)
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir. Kullanıcılar email adresi ve şifre belirleyerek hesap oluşturur.

3. **Menü Görüntüle** (Kamil Ertap)
   - **API Metodu:** `GET /menu/list`
   - **Açıklama:** Kullanıcıların menüyü görüntülemesine yarar.
   
4. **Menüye Ekle** (Kamil Ertap)
   - **API Metodu:** `POST /menu/add`
   - **Açıklama:** Adminin menüye ürün eklemesine yarar.

5. **Menüde Güncelle** (Kamil Ertap)
   - **API Metodu:** `PUT /menu/update/{urunId}`
   - **Açıklama:** Adminin menüde ürün güncellemesine yarar.

6. **Menüden Sil** (Kamil Ertap)
   - **API Metodu:** `DELETE /menu/delete/{urunId}`
   - **Açıklama:** Adminin menüden ürün silmesine yarar.

7. **Sipariş Ver** (Kamil Ertap)
   - **API Metodu:** `POST /order/add`
   - **Açıklama:** Kullanıcıların sipariş vermesine yarar.
   
8. **Sipariş Gör** (Kamil Ertap)
   - **API Metodu:** `GET /order/list`
   - **Açıklama:** Adminin siparişleri liste halinde görmesine yarar.

9. **Sipariş Güncelle** (Kamil Ertap)
   - **API Metodu:** `PUT /order/update/{orderId}`
   - **Açıklama:** Adminin sipariş güncellemesine yarar.

10. **Sipariş Sil** (Kamil Ertap)
   - **API Metodu:** `DELETE /order/delete/{orderId}`
   - **Açıklama:** Adminin sipariş silmesine yarar.
