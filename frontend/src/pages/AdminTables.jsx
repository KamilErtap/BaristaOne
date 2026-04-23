import { useEffect, useState } from 'react';
import { tableApi } from '../api/tableApi';
import { getTables } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';

const initialForm = {
  number: '',
  code: '',
  capacity: '',
  isActive: true,
  description: '',
};

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'number_asc',
    isActive: '',
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await tableApi.getTables(filters);
      setTables(getTables(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Masalar alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
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
        const response = await tableApi.updateTable(editingId, form);
        setMessage(response.data?.message || 'Masa güncellendi');
      } else {
        const response = await tableApi.createTable(form);
        setMessage(response.data?.message || 'Masa eklendi');
      }

      resetForm();
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (table) => {
    setEditingId(table._id);
    setForm({
      number: table.number || '',
      code: table.code || '',
      capacity: table.capacity || '',
      isActive: table.isActive ?? true,
      description: table.description || '',
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bu masayı silmek istediğine emin misin?');
    if (!confirmed) return;

    try {
      const response = await tableApi.deleteTable(id);
      setMessage(response.data?.message || 'Masa silindi');

      if (editingId === id) {
        resetForm();
      }

      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  if (loading) {
    return <Loading text="Masalar yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Masa Yönetimi"
        subtitle="Masaları ekle, düzenle ve QR altyapısına temel olacak yapıyı yönet."
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="panel-grid">
        <Card>
          <CardBody>
            <h2 style={{ marginBottom: '16px' }}>
              {editingId ? 'Masa Güncelle' : 'Yeni Masa Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="form-stack">
              <Input
                label="Masa Numarası"
                name="number"
                type="number"
                min="1"
                placeholder="Örn: 1"
                value={form.number}
                onChange={handleFormChange}
              />

              <Input
                label="Masa Kodu"
                name="code"
                placeholder="Örn: TBL-001"
                value={form.code}
                onChange={handleFormChange}
              />

              <Input
                label="Kapasite"
                name="capacity"
                type="number"
                min="1"
                placeholder="Örn: 4"
                value={form.capacity}
                onChange={handleFormChange}
              />

              <Input
                label="Açıklama"
                name="description"
                placeholder="Masa açıklaması"
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
                Masa aktif
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
                  placeholder="Masa ara..."
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
                  <option value="number_asc">Masa No Artan</option>
                  <option value="number_desc">Masa No Azalan</option>
                  <option value="capacity_asc">Kapasite Artan</option>
                  <option value="capacity_desc">Kapasite Azalan</option>
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                </Select>
              </div>
            </CardBody>
          </Card>

          {tables.length === 0 ? (
            <EmptyState
              title="Masa bulunamadı"
              description="Yeni masa ekleyerek başlayabilirsin."
            />
          ) : (
            <div style={styles.list}>
              {tables.map((table) => (
                <Card key={table._id}>
                  <CardBody>
                    <div style={styles.tableRow}>
                      <div>
                        <div style={styles.topRow}>
                          <h3>Masa {table.number}</h3>
                          <span className="badge">
                            {table.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>

                        <p style={styles.muted}>Kod: {table.code}</p>
                        <p style={styles.muted}>Kapasite: {table.capacity}</p>
                        <p style={styles.muted}>
                          {table.description || 'Açıklama yok'}
                        </p>
                      </div>

                      <div style={styles.actions}>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(table)}
                        >
                          Düzenle
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(table._id)}
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
  tableRow: {
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

export default AdminTables;