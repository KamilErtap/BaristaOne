import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { getItem } from '../api/responseHelpers';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

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
      setMessage('Sipariş vermek için giriş yapmalısınız.');
      return;
    }

    if (!isCustomer) {
      setMessage('Sadece müşteri hesabı sipariş verebilir.');
      return;
    }

    if (!tableNumber) {
      setMessage('Lütfen masa numarası girin.');
      return;
    }

    try {
      const payload = {
        items: [
          {
            menuItem: item._id,
            quantity: Number(quantity),
          },
        ],
        tableNumber: Number(tableNumber),
        paymentStatus: 'paid',
      };

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
      setMessage(err.response?.data?.message || 'Sipariş oluşturulamadı');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Ürün yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="message error">{error}</p>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="page-container">
      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        Geri Dön
      </button>

      <div className="panel-grid">
        <div className="card" style={{ overflow: 'hidden' }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.placeholder}>Görsel Yok</div>
          )}

          <div className="card-body">
            <div className="row-wrap" style={{ marginBottom: '12px' }}>
              <span className="badge">{item.category}</span>
              <span className="badge">{item.isAvailable ? 'Müsait' : 'Tükendi'}</span>
            </div>

            <h1 className="page-title" style={{ marginBottom: '12px' }}>{item.name}</h1>
            <p className="page-subtitle">{item.description}</p>

            <p style={styles.price}>{item.price} TL</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h2 style={{ marginBottom: '12px' }}>Sipariş Ver</h2>
            <p className="page-subtitle" style={{ marginBottom: '16px' }}>
              Bu ürünü doğrudan sipariş oluşturmak için kullanabilirsin.
            </p>

            <div className="form-stack">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Adet"
              />

              <input
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Masa Numarası"
              />

              <button
                className="btn-primary"
                onClick={handleOrder}
                disabled={!item.isAvailable}
              >
                Sipariş Oluştur
              </button>
            </div>

            {message && <p className="message success">{message}</p>}
          </div>
        </div>
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
  price: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#8b5e3c',
    marginTop: '18px',
  },
};

export default MenuDetail;