# API Tasarımı - OpenAPI Specification 

**OpenAPI Spesifikasyon Dosyası:** [api_tasarim.yaml](api_tasarim.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3

info:
  title: Cafe Sipariş Sistemi API
  version: 1.0.0
  description: >
    Bu API bir kafe sipariş sisteminin yönetilmesi için tasarlanmıştır.
    Kullanıcılar sisteme kayıt olabilir, giriş yapabilir, menüyü görüntüleyebilir
    ve sipariş oluşturabilir. Admin kullanıcılar menü ve siparişleri yönetebilir.

servers:
  - url: http://localhost:5000/api
    description: Development

tags:
  - name: Auth
    description: Kullanıcı kimlik doğrulama işlemleri
  - name: Menu
    description: Menü yönetimi
  - name: Orders
    description: Sipariş işlemleri

security:
  - BearerAuth: []

paths:
  /auth/register:
    post:
      tags:
        - Auth
      summary: Kullanıcı kayıt
      description: Yeni bir kullanıcı oluşturmak için kullanılır.
      operationId: registerUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterInput'
            examples:
              example1:
                summary: Örnek kullanıcı kaydı
                value:
                  name: Kamil Ertap
                  email: user@example.com
                  password: "123456"
      responses:
        "201":
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        "400":
          description: Geçersiz veri
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - Auth
      summary: Kullanıcı giriş
      description: Kayıtlı bir kullanıcı email ve şifresi ile giriş yapar.
      operationId: loginUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
            examples:
              example1:
                summary: Örnek giriş
                value:
                  email: user@example.com
                  password: "123456"
      responses:
        "200":
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        "401":
          description: Hatalı email veya şifre
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/me:
    get:
      tags:
        - Auth
      summary: Giriş yapan kullanıcıyı getir
      description: Token sahibi kullanıcının bilgilerini döndürür.
      operationId: getMe
      responses:
        "200":
          description: Kullanıcı bilgileri başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "401":
          description: Yetkisiz erişim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /menu:
    get:
      tags:
        - Menu
      summary: Menü listele
      description: Mevcut menüdeki tüm ürünleri listeler. Herkes erişebilir.
      operationId: listMenu
      security: []
      parameters:
        - name: category
          in: query
          description: Ürün kategorisine göre filtreleme
          schema:
            type: string
          example: Kahve
        - name: search
          in: query
          description: Ürün adında arama yapma
          schema:
            type: string
          example: latte
        - name: available
          in: query
          description: Ürünün mevcut olup olmadığına göre filtreleme
          schema:
            type: boolean
          example: true
        - name: sort
          in: query
          description: Sıralama kriteri
          schema:
            type: string
            enum:
              - price_asc
              - price_desc
              - name_asc
              - name_desc
              - newest
              - oldest
          example: price_asc
      responses:
        "200":
          description: Menü listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MenuItem'

    post:
      tags:
        - Menu
      summary: Menüye ürün ekle (Admin)
      description: Yeni bir ürün eklemek için kullanılır. Sadece admin kullanıcılar erişebilir.
      operationId: addMenuItem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MenuInput'
      responses:
        "201":
          description: Ürün eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItemResponse'
        "401":
          description: Yetkisiz erişim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "403":
          description: Admin yetkisi gerekli
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /menu/categories:
    get:
      tags:
        - Menu
      summary: Menü kategorilerini listele
      description: Menüde yer alan kategorileri döndürür.
      operationId: getMenuCategories
      security: []
      responses:
        "200":
          description: Kategoriler listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
                example:
                  - Kahve
                  - Tatlı
                  - Soğuk İçecek

  /menu/{urunId}:
    parameters:
      - name: urunId
        in: path
        required: true
        description: Menü ürününün ID değeri
        schema:
          type: string
        example: menu123

    get:
      tags:
        - Menu
      summary: Tek bir menü ürününü getir
      description: Belirli bir ürünün detaylarını getirir.
      operationId: getMenuItemById
      security: []
      responses:
        "200":
          description: Ürün getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItem'
        "404":
          description: Ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      tags:
        - Menu
      summary: Menü ürünü güncelle (Admin)
      description: Var olan bir ürünün bilgilerini güncellemek için kullanılır. Sadece admin kullanıcılar erişebilir.
      operationId: updateMenuItem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MenuInput'
      responses:
        "200":
          description: Ürün güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuItemResponse'
        "404":
          description: Ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      tags:
        - Menu
      summary: Menü ürünü sil (Admin)
      description: Var olan bir ürünü menüden silmek için kullanılır. Sadece admin kullanıcılar erişebilir.
      operationId: deleteMenuItem
      responses:
        "200":
          description: Ürün silindi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
        "404":
          description: Ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /orders:
    post:
      tags:
        - Orders
      summary: Sipariş oluştur
      description: Kayıtlı bir kullanıcı yeni bir sipariş oluşturur. Siparişin oluşabilmesi için paymentStatus değeri paid olmalıdır.
      operationId: createOrder
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderInput'
      responses:
        "201":
          description: Sipariş oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
        "400":
          description: Geçersiz sipariş verisi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    get:
      tags:
        - Orders
      summary: Siparişleri listele (Admin)
      description: Tüm siparişleri listeler. Sadece admin kullanıcılar erişebilir.
      operationId: listOrders
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum:
              - received
              - preparing
              - ready
              - delivered
        - name: paymentStatus
          in: query
          schema:
            type: string
            enum:
              - pending
              - paid
        - name: tableNumber
          in: query
          schema:
            type: integer
        - name: sort
          in: query
          schema:
            type: string
            enum:
              - newest
              - oldest
              - price_asc
              - price_desc
              - table_asc
              - table_desc
      responses:
        "200":
          description: Siparişler listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Order'

  /orders/my-orders:
    get:
      tags:
        - Orders
      summary: Kendi siparişlerini listele
      description: Giriş yapan kullanıcının kendi siparişlerini listeler.
      operationId: getMyOrders
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum:
              - received
              - preparing
              - ready
              - delivered
        - name: tableNumber
          in: query
          schema:
            type: integer
        - name: sort
          in: query
          schema:
            type: string
            enum:
              - newest
              - oldest
              - price_asc
              - price_desc
              - table_asc
              - table_desc
      responses:
        "200":
          description: Kullanıcının siparişleri listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Order'

  /orders/{orderId}/status:
    parameters:
      - name: orderId
        in: path
        required: true
        schema:
          type: string
        example: order456

    put:
      tags:
        - Orders
      summary: Sipariş durumu güncelle (Admin)
      description: Var olan bir siparişin durumunu güncellemek için kullanılır. Sadece admin kullanıcılar erişebilir.
      operationId: updateOrderStatus
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderStatusInput'
      responses:
        "200":
          description: Sipariş güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
        "404":
          description: Sipariş bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    BearerAuth:
      type: apiKey
      in: header
      name: Authorization
      description: JWT token kullanılır. "Bearer <token>"

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          example: user123
        name:
          type: string
          example: Kamil Ertap
        email:
          type: string
          example: user@email.com
        role:
          type: string
          example: customer

    RegisterInput:
      type: object
      properties:
        name:
          type: string
          example: Kamil Ertap
        email:
          type: string
          example: user@email.com
        password:
          type: string
          example: "123456"
      required:
        - name
        - email
        - password

    LoginInput:
      type: object
      properties:
        email:
          type: string
          example: user@email.com
        password:
          type: string
          example: "123456"
      required:
        - email
        - password

    AuthResponse:
      type: object
      properties:
        message:
          type: string
          example: Giriş başarılı
        token:
          type: string
          example: jwt-token-example
        user:
          $ref: '#/components/schemas/User'

    MenuItem:
      type: object
      properties:
        _id:
          type: string
          example: menu123
        name:
          type: string
          example: Latte
        description:
          type: string
          example: Sıcak sütlü kahve
        price:
          type: number
          example: 120
        category:
          type: string
          example: Kahve
        image:
          type: string
          example: latte.jpg
        isAvailable:
          type: boolean
          example: true
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    MenuInput:
      type: object
      properties:
        name:
          type: string
        description:
          type: string
        price:
          type: number
        category:
          type: string
        image:
          type: string
        isAvailable:
          type: boolean
      required:
        - name
        - price
        - category

    MenuItemResponse:
      type: object
      properties:
        message:
          type: string
          example: Ürün başarıyla eklendi
        item:
          $ref: '#/components/schemas/MenuItem'

    OrderItem:
      type: object
      properties:
        menuItem:
          type: string
          example: menu123
        name:
          type: string
          example: Latte
        quantity:
          type: integer
          example: 2
        price:
          type: number
          example: 120

    Order:
      type: object
      properties:
        _id:
          type: string
          example: order456
        customer:
          oneOf:
            - type: string
            - $ref: '#/components/schemas/User'
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        tableNumber:
          type: integer
          example: 4
        totalPrice:
          type: number
          example: 360
        paymentStatus:
          type: string
          example: paid
        orderStatus:
          type: string
          example: received
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    OrderInput:
      type: object
      properties:
        items:
          type: array
          items:
            type: object
            properties:
              menuItem:
                type: string
                example: menu123
              quantity:
                type: integer
                example: 2
            required:
              - menuItem
        tableNumber:
          type: integer
          example: 4
        paymentStatus:
          type: string
          enum:
            - pending
            - paid
          example: paid
      required:
        - items
        - tableNumber
        - paymentStatus

    OrderStatusInput:
      type: object
      properties:
        orderStatus:
          type: string
          enum:
            - received
            - preparing
            - ready
            - delivered
          example: ready
      required:
        - orderStatus

    OrderResponse:
      type: object
      properties:
        message:
          type: string
          example: Sipariş başarıyla oluşturuldu
        order:
          $ref: '#/components/schemas/Order'

    MessageResponse:
      type: object
      properties:
        message:
          type: string
          example: İşlem başarılı

    Error:
      type: object
      properties:
        message:
          type: string
          example: Bir hata oluştu
``
