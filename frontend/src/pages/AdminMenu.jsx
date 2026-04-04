import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  isAvailable: true,
};

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/menu');
      setItems(data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Menü verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable,
    });
    setMessage('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        const { data } = await api.put(`/menu/${editingId}`, {
          ...form,
          price: Number(form.price),
        });
        setMessage(data.message || 'Ürün güncellendi');
      } else {
        const { data } = await api.post('/menu', {
          ...form,
          price: Number(form.price),
        });
        setMessage(data.message || 'Ürün eklendi');
      }

      setForm(initialForm);
      setEditingId(null);
      fetchItems();
    } catch (error) {
      setError(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bu ürünü silmek istediğine emin misin?');
    if (!confirmed) return;

    try {
      const { data } = await api.delete(`/menu/${id}`);
      setMessage(data.message || 'Ürün silindi');
      fetchItems();

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  return (
    <div className="page-container">
      <div style={styles.formBox}>
        <h1 className="page-title">Admin Menü Yönetimi</h1>
        <p className="page-subtitle">
          Ürün ekle, güncelle, sil ve menüyü canlı tut.
        </p>
        <h2>{editingId ? 'Ürün Güncelle' : 'Yeni Ürün Ekle'}</h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
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

          <button type="submit">
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancelEdit}>
              İptal
            </button>
          )}
        </form>
      </div>

      <div style={styles.listBox}>
        <h2>Menü Ürünleri</h2>

        {loading && <p>Ürünler yükleniyor...</p>}

        {!loading && items.length === 0 && <p>Henüz ürün yok.</p>}

        {!loading && items.length > 0 && (
          <div className="panel-grid">
            {items.map((item) => (
              <div key={item._id} style={styles.card}>
                <h3>{item.name}</h3>
                {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '12px',
                  }}
                />
                ) : (
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    display: 'grid',
                    placeItems: 'center',
                    background: '#e2e8f0',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    color: '#64748b',
                    fontWeight: 600,
                  }}
                >
                Görsel Yok
                </div>
                )}
                <p>{item.description}</p>
                <p><strong>Kategori:</strong> {item.category}</p>
                <p><strong>Fiyat:</strong> {item.price} TL</p>
                <p>
                  <strong>Durum:</strong>{' '}
                  {item.isAvailable ? 'Müsait' : 'Tükendi'}
                </p>

                <div style={styles.actions}>
                  <button onClick={() => navigate(`/admin/menu/${item._id}`)}>Düzenle</button>
                  <button onClick={() => handleDelete(item._id)}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
    padding: '24px',
  },
  formBox: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    height: 'fit-content',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  listBox: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  checkboxRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
};

export default AdminMenu;