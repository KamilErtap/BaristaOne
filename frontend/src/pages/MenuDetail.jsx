import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { getItem } from '../api/responseHelpers';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [tableNumber, setTableNumber] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isCustomer = userInfo?.user?.role === 'customer';

  const fetchItem = async () => {
    try {
      setLoading(true);

      const response = await menuApi.getMenuItemById(id);
      setItem(getItem(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ürün bilgisi alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleOrder = async () => {
    setMessage('');
    setError('');

    if (!userInfo) {
      setError('Sipariş vermek için giriş yapmalısınız.');
      return;
    }

    if (!isCustomer) {
      setError('Sadece müşteri hesabı sipariş verebilir.');
      return;
    }

    if (!item?.isAvailable) {
      setError('Bu ürün şu anda siparişe kapalı.');
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      setError('Lütfen geçerli bir adet girin.');
      return;
    }

    if (!tableNumber || Number(tableNumber) < 1) {
      setError('Lütfen geçerli bir masa numarası girin.');
      return;
    }

    try {
      setOrdering(true);

      const response = await orderApi.createOrder({
        cart: [
          {
            ...item,
            quantity: Number(quantity),
          },
        ],
        tableNumber,
      });

      setMessage(response.data?.message || 'Sipariş oluşturuldu.');
      setTableNumber('');
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <Loading text="Ürün yükleniyor..." />;
  }

  if (error && !item) {
    return (
      <div className="page-container">
        <PageHeader
          title="Ürün Detayı"
          subtitle="Ürün bilgisi alınırken bir hata oluştu."
          actions={
            <Button variant="secondary" onClick={() => navigate('/menu')}>
              Menüye Dön
            </Button>
          }
        />

        <EmptyState title="Ürün bulunamadı" description={error} />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="page-container">
      <PageHeader
        title={item.name}
        subtitle="Ürün detayını incele ve istersen doğrudan sipariş oluştur."
        actions={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Geri Dön
          </Button>
        }
      />

      <div className="panel-grid">
        <Card style={{ overflow: 'hidden' }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.placeholder}>Görsel Yok</div>
          )}

          <CardBody>
            <div style={styles.badgeRow}>
              <Badge>{item.category}</Badge>
              <Badge variant={item.isAvailable ? 'success' : 'danger'}>
                {item.isAvailable ? 'Müsait' : 'Tükendi'}
              </Badge>
            </div>

            <h2 style={styles.title}>{item.name}</h2>

            <p style={styles.description}>
              {item.description || 'Bu ürün için açıklama bulunmuyor.'}
            </p>

            <p style={styles.price}>{item.price} TL</p>
          </CardBody>
        </Card>

        <Card style={styles.orderCard}>
          <CardBody>
            <h2 style={{ marginBottom: '12px' }}>Sipariş Ver</h2>
            <p style={styles.muted}>
              Bu ürünü tek başına hızlıca sipariş oluşturmak için kullanabilirsin.
            </p>

            <div className="form-stack" style={{ marginTop: '16px' }}>
              <Input
                label="Adet"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Adet"
              />

              <Input
                label="Masa Numarası"
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Örn: 4"
              />

              <Button
                variant="primary"
                onClick={handleOrder}
                disabled={!item.isAvailable || ordering}
                style={{ width: '100%' }}
              >
                {ordering ? 'Sipariş oluşturuluyor...' : 'Sipariş Oluştur'}
              </Button>
            </div>

            {!item.isAvailable && (
              <p className="message error">
                Bu ürün şu anda siparişe kapalı.
              </p>
            )}

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  image: {
    width: '100%',
    height: '380px',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    height: '380px',
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    color: '#64748b',
    fontWeight: 700,
  },
  badgeRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  description: {
    color: '#64748b',
    lineHeight: 1.6,
  },
  price: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#8b5e3c',
    marginTop: '18px',
  },
  orderCard: {
    height: 'fit-content',
    position: 'sticky',
    top: '96px',
  },
  muted: {
    color: '#64748b',
  },
};

export default MenuDetail;