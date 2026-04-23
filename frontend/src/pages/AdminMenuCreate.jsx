import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { categoryApi } from '../api/categoryApi';
import { getCategoryList } from '../api/responseHelpers';
import Select from '../components/common/Select';
import PageHeader from '../components/common/PageHeader';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  isAvailable: true,
};

const AdminMenuCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories({ isActive: true, sort: 'name_asc' });
        setCategories(getCategoryList(response));
      } catch (err) {
        console.error('Kategoriler alınamadı');
      }
    };  

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!form.name || !form.price || !form.category) {
      setError('Ürün adı, fiyat ve kategori zorunludur.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await menuApi.createMenuItem(form);
      setMessage(response.data?.message || 'Ürün başarıyla eklendi.');
      setForm(initialForm);

      setTimeout(() => {
        navigate('/admin/menu');
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Ürün eklenemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Yeni Ürün Ekle"
        subtitle="Menüye yeni bir ürün eklemek için formu doldur."
        actions={
          <Button variant="secondary" onClick={() => navigate('/admin/menu')}>
            Menüye Dön
          </Button>
        }
      />

      <div className="panel-grid">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="form-stack">
              <Input
                label="Ürün Adı"
                name="name"
                placeholder="Örn: Latte"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                label="Açıklama"
                name="description"
                placeholder="Örn: Sütlü kahve"
                value={form.description}
                onChange={handleChange}
              />

              <Input
                label="Fiyat"
                name="price"
                type="number"
                min="0"
                placeholder="Örn: 120"
                value={form.price}
                onChange={handleChange}
              />

              <Select
                label="Kategori"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Kategori Seç</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Görsel URL"
                name="image"
                placeholder="https://..."
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

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Ekleniyor...' : 'Ürünü Ekle'}
              </Button>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 style={{ marginBottom: '12px' }}>Önizleme</h2>

            {form.image ? (
              <img
                src={form.image}
                alt={form.name || 'Ürün önizleme'}
                style={styles.previewImage}
              />
            ) : (
              <div style={styles.placeholder}>Görsel Yok</div>
            )}

            <div style={{ marginTop: '16px' }}>
              <span className="badge">
                {form.category || 'Kategori'}
              </span>

              <h2 style={{ marginTop: '12px' }}>
                {form.name || 'Ürün Adı'}
              </h2>

              <p style={styles.muted}>
                {form.description || 'Ürün açıklaması burada görünecek.'}
              </p>

              <p style={styles.price}>
                {form.price ? `${form.price} TL` : '0 TL'}
              </p>

              <p style={styles.muted}>
                Durum: {form.isAvailable ? 'Müsait' : 'Tükendi'}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  previewImage: {
    width: '100%',
    height: '260px',
    objectFit: 'cover',
    borderRadius: '16px',
  },
  placeholder: {
    width: '100%',
    height: '260px',
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    borderRadius: '16px',
    color: '#64748b',
    fontWeight: 700,
  },
  muted: {
    color: '#64748b',
    marginTop: '8px',
  },
  price: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#8b5e3c',
    marginTop: '14px',
  },
};

export default AdminMenuCreate;