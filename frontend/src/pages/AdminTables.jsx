import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { tableApi } from '../api/tableApi';
import { getTables } from '../api/responseHelpers';
import Checkbox from '../components/common/Checkbox';
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

const buildTableMenuUrl = (tableCode) => {
  return `${window.location.origin}/table/${tableCode}/menu`;
};

const downloadTableQr = (table) => {
  const canvas = document.getElementById(`table-qr-${table._id}`);
  if (!canvas) return;

  const pngUrl = canvas
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');

  const link = document.createElement('a');
  link.href = pngUrl;
  link.download = `masa-${table.number}-qr.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const printTableCard = (table) => {
  const canvas = document.getElementById(`table-qr-${table._id}`);
  if (!canvas) return;

  const qrImage = canvas.toDataURL('image/png');
  const tableUrl = buildTableMenuUrl(table.code);

  const printWindow = window.open('', '_blank', 'width=800,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Masa ${table.number} QR Kartı</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            margin: 0;
            background: #f8fafc;
          }

          .card {
            max-width: 420px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 24px;
            text-align: center;
            box-sizing: border-box;
          }

          .title {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 8px;
          }

          .meta {
            color: #64748b;
            margin-bottom: 10px;
            line-height: 1.5;
          }

          .qr {
            margin: 20px auto;
            width: fit-content;
          }

          .qr img {
            width: 220px;
            height: 220px;
            display: block;
          }

          .url {
            word-break: break-all;
            color: #8b5e3c;
            font-size: 14px;
            margin-top: 16px;
            line-height: 1.5;
          }

          .note {
            margin-top: 14px;
            font-size: 14px;
            color: #475569;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }

            .card {
              border: none;
              box-shadow: none;
              margin-top: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">Masa ${table.number}</div>
          <div class="meta">Kod: ${table.code} · Kapasite: ${table.capacity}</div>
          <div class="meta">${table.description || 'BaristaOne Masa Menüsü'}</div>
          <div class="qr">
            <img src="${qrImage}" alt="QR Kod" />
          </div>
          <div class="url">${tableUrl}</div>
          <div class="note">Bu QR kod okutulduğunda masa menüsü açılır.</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 300);
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

  const handleCopyLink = async (table) => {
    try {
      const tableUrl = buildTableMenuUrl(table.code);
      await navigator.clipboard.writeText(tableUrl);
      setMessage(`Masa ${table.number} linki kopyalandı`);
      setError('');
    } catch (err) {
      setError('Link kopyalanamadı');
    }
  };

  if (loading) {
    return <Loading text="Masalar yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Masa Yönetimi"
        subtitle="Masaları ekle, düzenle ve QR ile menü akışını yönet."
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

              <Checkbox
                name="isActive"
                checked={form.isActive}
                onChange={handleFormChange}
                label="Masa aktif"
                description="Kapalıysa masa QR ile açılsa bile sipariş akışında kullanılmaz."
              />

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
              {tables.map((table) => {
                const tableUrl = buildTableMenuUrl(table.code);

                return (
                  <Card key={table._id}>
                    <CardBody>
                      <div style={styles.tableCard}>
                        <div style={styles.tableInfo}>
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

                          <div style={styles.urlBox}>
                            <strong>Masa Linki</strong>
                            <a
                              href={tableUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.link}
                            >
                              {tableUrl}
                            </a>
                          </div>

                          <div style={styles.actions}>
                            <Button
                              variant="secondary"
                              onClick={() => handleEdit(table)}
                            >
                              Düzenle
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => handleCopyLink(table)}
                            >
                              Linki Kopyala
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => downloadTableQr(table)}
                            >
                              QR İndir
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={() => printTableCard(table)}
                            >
                              Yazdır
                            </Button>

                            <Button
                              variant="danger"
                              onClick={() => handleDelete(table._id)}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>

                        <div style={styles.qrBox}>
                          <QRCodeCanvas
                            id={`table-qr-${table._id}`}
                            value={tableUrl}
                            size={160}
                            includeMargin={true}
                          />
                          <p style={styles.qrText}>QR ile Menü Aç</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
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
  tableCard: {
    display: 'grid',
    gridTemplateColumns: '1fr 200px',
    gap: '20px',
    alignItems: 'center',
  },
  tableInfo: {
    minWidth: 0,
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
  urlBox: {
    marginTop: '14px',
    padding: '12px',
    borderRadius: '14px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    display: 'grid',
    gap: '8px',
  },
  link: {
    color: '#8b5e3c',
    wordBreak: 'break-all',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  qrBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  qrText: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#475569',
    textAlign: 'center',
  },
};

export default AdminTables;