import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const AdminMenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchItem = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/menu/${id}`);

      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        category: data.category || '',
        image: data.image || '',
        isAvailable: data.isAvailable ?? true,
      });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const { data } = await api.put(`/menu/${id}`, {
        ...form,
        price: Number(form.price),
      });

      setMessage(data.message || 'Ürün güncellendi');
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme başarısız');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Bu ürünü silmek istediğine emin misin?');
    if (!confirmed) return;

    try {
      await api.delete(`/menu/${id}`);
      navigate('/admin/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Ürün yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        Geri Dön
      </button>

      <div className="panel-grid">
        <div className="card" style={{ overflow: 'hidden' }}>
          {form.image ? (
            <img
              src={form.image}
              alt={form.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.placeholder}>Görsel Yok</div>
          )}

          <div className="card-body">
            <h1 className="page-title" style={{ marginBottom: '12px' }}>
              {form.name || 'Ürün Detayı'}
            </h1>
            <p className="page-subtitle">{form.description}</p>

            <div className="row-wrap section-gap">
              <span className="badge">{form.category || 'Kategori yok'}</span>
              <span className="badge">{form.isAvailable ? 'Müsait' : 'Tükendi'}</span>
            </div>

            <p style={styles.price}>{form.price} TL</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h2 style={{ marginBottom: '12px' }}>Ürünü Güncelle</h2>

            <form onSubmit={handleUpdate} className="form-stack">
              <input
                type="text"
                name="name"
                placeholder="Ürün adı"
                value={form.name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="description"
                placeholder="Açıklama"
                value={form.description}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                placeholder="Fiyat"
                value={form.price}
                onChange={handleChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Kategori"
                value={form.category}
                onChange={handleChange}
              />

              <input
                type="text"
                name="image"
                placeholder="Görsel URL"
                value={form.image}
                onChange={handleChange}
              />

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
                Ürün mevcut
              </label>

              <div className="row-wrap">
                <button type="submit" className="btn-primary">
                  Güncelle
                </button>
                <button type="button" className="btn-danger" onClick={handleDelete}>
                  Sil
                </button>
              </div>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
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
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

export default AdminMenuDetail;