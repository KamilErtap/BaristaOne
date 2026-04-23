import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Sepet"
          subtitle="Sepetin şu an boş. Menüden ürün seçerek başlayabilirsin."
        />

        <EmptyState
          title="Sepet boş"
          description="Menüye dönüp ürün ekleyebilirsin."
        />

        <div style={{ marginTop: '16px' }}>
          <Link to="/menu" className="btn-primary" style={styles.linkButton}>
            Menüye Git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Sepet"
        subtitle="Siparişe dönüştürmeden önce ürünlerini kontrol et."
        actions={
          <Button variant="danger" onClick={clearCart}>
            Sepeti Temizle
          </Button>
        }
      />

      <div className="panel-grid">
        <div style={styles.list}>
          {cart.map((item) => (
            <Card key={item._id}>
              <CardBody>
                <div style={styles.cartItem}>
                  <div style={styles.productInfo}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={styles.image} />
                    ) : (
                      <div style={styles.placeholder}>Görsel Yok</div>
                    )}

                    <div>
                      <h3>{item.name}</h3>
                      <p style={styles.muted}>{item.category}</p>
                      <p>{item.price} TL</p>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <Button
                      variant="secondary"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      -
                    </Button>

                    <strong>{item.quantity}</strong>

                    <Button
                      variant="secondary"
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card style={styles.summary}>
          <CardBody>
            <h2>Sipariş Özeti</h2>

            <div style={styles.summaryRow}>
              <span>Toplam Ürün</span>
              <strong>{totalItems}</strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Toplam Tutar</span>
              <strong>{totalPrice} TL</strong>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', marginTop: '16px' }}
            >
              Checkout'a Git
            </Button>

            <Link to="/menu" className="btn-secondary" style={styles.secondaryLink}>
              Menüye Dön
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  list: {
    display: 'grid',
    gap: '14px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productInfo: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  image: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '14px',
  },
  placeholder: {
    width: '90px',
    height: '90px',
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    borderRadius: '14px',
    color: '#64748b',
    fontSize: '12px',
  },
  muted: {
    color: '#64748b',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  summary: {
    height: 'fit-content',
    position: 'sticky',
    top: '96px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  },
  linkButton: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: '12px',
  },
  secondaryLink: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    padding: '10px 14px',
    borderRadius: '12px',
  },
};

export default Cart;