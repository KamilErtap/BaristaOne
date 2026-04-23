import { useEffect, useState } from 'react';
import { categoryApi } from '../api/categoryApi';
import { getCategoryList } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

const initialForm = {
  name: '',
  description: '',
  isActive: true,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest',
    isActive: '',
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategories(filters);
      setCategories(getCategoryList(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Kategoriler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        const response = await categoryApi.updateCategory(editingId, form);
        setMessage(response.data?.message || 'Kategori güncellendi');
      } else {
        const response = await categoryApi.createCategory(form);
        setMessage(response.data?.message || 'Kategori eklendi');
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || '',
      description: category.description || '',
      isActive: category.isActive ?? true,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bu kategoriyi silmek istediğine emin misin?');
    if (!confirmed) return;

    try {
      const response = await categoryApi.deleteCategory(id);
      setMessage(response.data?.message || 'Kategori silindi');

      if (editingId === id) {
        resetForm();
      }

      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  if (loading) {
    return <Loading text="Kategoriler yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Kategori Yönetimi"
        subtitle="Kategorileri ekle, düzenle ve ürün formlarında kullanılacak yapıyı yönet."
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="panel-grid">
        <Card>
          <CardBody>
            <h2 style={{ marginBottom: '16px' }}>
              {editingId ? 'Kategori Güncelle' : 'Yeni Kategori Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="form-stack">
              <Input
                label="Kategori Adı"
                name="name"
                placeholder="Örn: Kahve"
                value={form.name}
                onChange={handleFormChange}
              />

              <Input
                label="Açıklama"
                name="description"
                placeholder="Kategori açıklaması"
                value={form.description}
                onChange={handleFormChange}
              />

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                />
                Kategori aktif
              </label>

              <div style={styles.formActions}>
                <Button type="submit" variant="primary">
                  {editingId ? 'Güncelle' : 'Ekle'}
                </Button>

                {editingId && (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    İptal
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>

        <div>
          <Card style={{ marginBottom: '16px' }}>
            <CardBody>
              <div className="admin-filter-box">
                <Input
                  label="Arama"
                  name="search"
                  placeholder="Kategori ara..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />

                <Select
                  label="Durum"
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                >
                  <option value="">Tümü</option>
                  <option value="true">Aktif</option>
                  <option value="false">Pasif</option>
                </Select>

                <Select
                  label="Sıralama"
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="name_asc">İsim A-Z</option>
                  <option value="name_desc">İsim Z-A</option>
                </Select>
              </div>
            </CardBody>
          </Card>

          {categories.length === 0 ? (
            <EmptyState
              title="Kategori bulunamadı"
              description="Yeni kategori ekleyerek başlayabilirsin."
            />
          ) : (
            <div style={styles.list}>
              {categories.map((category) => (
                <Card key={category._id}>
                  <CardBody>
                    <div style={styles.categoryRow}>
                      <div>
                        <div style={styles.topRow}>
                          <h3>{category.name}</h3>
                          <span className="badge">
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>

                        <p style={styles.muted}>
                          {category.description || 'Açıklama yok'}
                        </p>
                      </div>

                      <div style={styles.actions}>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(category)}
                        >
                          Düzenle
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(category._id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
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
  formActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  list: {
    display: 'grid',
    gap: '14px',
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  muted: {
    color: '#64748b',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
};

export default AdminCategories;