import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import PageHeader from '../components/common/PageHeader';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

const Checkout = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const {
    cart,
    clearCart,
    totalPrice,
    totalItems,
    selectedTable,
  } = useCart();

  useEffect(() => {
    if (selectedTable?.number) {
      setTableNumber(String(selectedTable.number));
    }
  }, [selectedTable]);

  const [tableNumber, setTableNumber] = useState(
    selectedTable?.number ? String(selectedTable.number) : ''
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isCustomer = userInfo?.user?.role === 'customer';

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (cart.length === 0) {
      setError('Sepet boş.');
      return;
    }

    if (!tableNumber) {
      setError('Lütfen masa numarası girin.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await orderApi.createOrder({
        cart,
        tableNumber,
      });

      setMessage(response.data?.message || 'Sipariş başarıyla oluşturuldu.');
      clearCart();
      setTableNumber('');

      setTimeout(() => {
        navigate('/orders');
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          title="Checkout"
          subtitle="Sipariş oluşturmak için sepetinde ürün olmalı."
        />

        <EmptyState
          title="Sepet boş"
          description="Menüden ürün ekledikten sonra checkout sayfasına dönebilirsin."
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
        title="Checkout"
        subtitle="Masa numaranı girerek siparişini tamamla."
      />

      <div className="panel-grid">
        <Card>
          <CardBody>
            <h2 style={{ marginBottom: '16px' }}>Sipariş Bilgileri</h2>

            <form onSubmit={handleSubmit} className="form-stack">
              <Input
                label="Masa Numarası"
                type="number"
                min="1"
                placeholder="Örn: 4"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />

              {selectedTable && (
                <div style={styles.tableInfoBox}>
                  <strong>Seçili Masa</strong>
                  <p style={styles.muted}>
                    Masa {selectedTable.number} · Kod: {selectedTable.code}
                  </p>
                </div>
              )}

              <div style={styles.paymentBox}>
                <strong>Ödeme Durumu</strong>
                <p style={styles.muted}>
                  Bu sürümde ödeme simülasyon olarak tamamlanmış kabul edilir.
                </p>
                <span className="badge">paymentStatus: paid</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Sipariş oluşturuluyor...' : 'Siparişi Tamamla'}
              </Button>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
          </CardBody>
        </Card>

        <Card style={styles.summary}>
          <CardBody>
            <h2>Sipariş Özeti</h2>

            <div style={styles.items}>
              {cart.map((item) => (
                <div key={item._id} style={styles.itemRow}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <strong>{item.price * item.quantity} TL</strong>
                </div>
              ))}
            </div>

            <div style={styles.summaryRow}>
              <span>Toplam Ürün</span>
              <strong>{totalItems}</strong>
            </div>

            <div style={styles.summaryRow}>
              <span>Toplam Tutar</span>
              <strong>{totalPrice} TL</strong>
            </div>

            <Link to="/cart" className="btn-secondary" style={styles.secondaryLink}>
              Sepete Dön
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  paymentBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '14px',
  },
  muted: {
    color: '#64748b',
    margin: '6px 0 10px',
  },
  summary: {
    height: 'fit-content',
    position: 'sticky',
    top: '96px',
  },
  items: {
    display: 'grid',
    gap: '10px',
    marginTop: '16px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0',
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
    marginTop: '16px',
    padding: '10px 14px',
    borderRadius: '12px',
  },
  tableInfoBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '14px',
  },
};

export default Checkout;