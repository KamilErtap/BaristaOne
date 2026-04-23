import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { menuApi } from '../api/menuApi';
import { getItem } from '../api/responseHelpers';
import { categoryApi } from '../api/categoryApi';
import { getCategoryList } from '../api/responseHelpers';
import Select from '../components/common/Select';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Checkbox from '../components/common/Checkbox';

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

  const [originalItem, setOriginalItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchItem = async () => {
    try {
      setLoading(true);

      const response = await menuApi.getMenuItemById(id);
      const item = getItem(response);

      const normalizedItem = {
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || '',
        image: item.image || '',
        isAvailable: item.isAvailable ?? true,
      };

      setForm(normalizedItem);
      setOriginalItem(normalizedItem);
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

  const hasChanges = () => {
    if (!originalItem) return false;

    return (
      form.name !== originalItem.name ||
      form.description !== originalItem.description ||
      String(form.price) !== String(originalItem.price) ||
      form.category !== originalItem.category ||
      form.image !== originalItem.image ||
      form.isAvailable !== originalItem.isAvailable
    );
  };

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

    setMessage('');
    setError('');

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!form.name || !form.price || !form.category) {
      setError('Ürün adı, fiyat ve kategori alanları zorunludur.');
      return;
    }

    try {
      setSaving(true);

      const response = await menuApi.updateMenuItem(id, form);
      const updatedItem = getItem(response);

      const nextOriginal = {
        name: updatedItem.name || form.name,
        description: updatedItem.description || form.description,
        price: updatedItem.price ?? form.price,
        category: updatedItem.category || form.category,
        image: updatedItem.image || form.image,
        isAvailable: updatedItem.isAvailable ?? form.isAvailable,
      };

      setOriginalItem(nextOriginal);
      setForm(nextOriginal);
      setMessage(response.data?.message || 'Ürün güncellendi');
    } catch (err) {
      console.log('UPDATE ERROR:', err.response?.data || err);
      setError(err.response?.data?.message || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Bu ürünü silmek istediğine emin misin? Bu işlem geri alınamaz.'
    );

    if (!confirmed) return;

    try {
      await menuApi.deleteMenuItem(id);
      navigate('/admin/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız.');
    }
  };

  const handleReset = () => {
    if (!originalItem) return;
    setForm(originalItem);
    setMessage('');
    setError('');
  };

  if (loading) {
    return <Loading text="Ürün bilgisi yükleniyor..." />;
  }

  if (error && !originalItem) {
    return (
      <div>
        <PageHeader
          title="Ürün Detayı"
          subtitle="Ürün bilgisi alınırken bir hata oluştu."
          actions={
            <Button variant="secondary" onClick={() => navigate('/admin/menu')}>
              Menüye Dön
            </Button>
          }
        />

        <EmptyState title="Ürün bulunamadı" description={error} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Ürün Detayı"
        subtitle="Ürün bilgilerini görüntüle, düzenle veya ürünü menüden kaldır."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/admin/menu')}>
              Menüye Dön
            </Button>

            <Button variant="danger" onClick={handleDelete}>
              Ürünü Sil
            </Button>
          </>
        }
      />

      <div style={styles.layout}>
        <Card style={styles.previewCard}>
          <div style={styles.imageWrap}>
            {form.image ? (
              <img src={form.image} alt={form.name} style={styles.image} />
            ) : (
              <div style={styles.placeholder}>Görsel Yok</div>
            )}
          </div>

          <CardBody>
            <div style={styles.badgeRow}>
              <Badge>{form.category || 'Kategori Yok'}</Badge>
              <Badge variant={form.isAvailable ? 'success' : 'danger'}>
                {form.isAvailable ? 'Satışta' : 'Tükendi'}
              </Badge>
            </div>

            <h2 style={styles.productTitle}>
              {form.name || 'Ürün adı girilmedi'}
            </h2>

            <p style={styles.description}>
              {form.description || 'Bu ürün için açıklama girilmedi.'}
            </p>

            <div style={styles.priceBox}>
              <span>Fiyat</span>
              <strong>{form.price || 0} TL</strong>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div style={styles.formHeader}>
              <div>
                <h2>Ürünü Güncelle</h2>
                <p style={styles.muted}>
                  Değişiklikleri yaptıktan sonra kaydet butonuna bas.
                </p>
              </div>

              {hasChanges() && (
                <span style={styles.unsavedBadge}>Kaydedilmemiş değişiklik</span>
              )}
            </div>

            <form onSubmit={handleUpdate} className="form-stack">
              <Input
                label="Ürün Adı"
                type="text"
                name="name"
                placeholder="Örn: Latte"
                value={form.name}
                onChange={handleChange}
              />

              <label style={styles.field}>
                <span style={styles.label}>Açıklama</span>
                <textarea
                  name="description"
                  placeholder="Ürün açıklaması"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  style={styles.textarea}
                />
              </label>

              <div style={styles.twoColumn}>
                <Input
                  label="Fiyat"
                  type="number"
                  name="price"
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
              </div>

              <Input
                label="Görsel URL"
                type="text"
                name="image"
                placeholder="https://..."
                value={form.image}
                onChange={handleChange}
              />

              <Checkbox
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                label="Ürün satışta"
                description="Kapalıysa müşteri ürünü görebilir ama siparişe ekleyemez."
              />

              <div style={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || !hasChanges()}
                >
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={!hasChanges() || saving}
                >
                  Değişiklikleri Geri Al
                </Button>
              </div>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  previewCard: {
    overflow: 'hidden',
    position: 'sticky',
    top: '96px',
  },
  imageWrap: {
    width: '100%',
    height: '320px',
    background: '#e2e8f0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    fontWeight: 800,
  },
  badgeRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  productTitle: {
    fontSize: '26px',
    marginBottom: '8px',
  },
  description: {
    color: '#64748b',
    lineHeight: 1.6,
  },
  priceBox: {
    marginTop: '18px',
    padding: '16px',
    borderRadius: '16px',
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  muted: {
    color: '#64748b',
    fontSize: '14px',
  },
  unsavedBadge: {
    height: 'fit-content',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '13px',
    fontWeight: 800,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '110px',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    background: '#f8fafc',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '3px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
};

export default AdminMenuDetail;