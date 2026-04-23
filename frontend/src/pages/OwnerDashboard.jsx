import { useEffect, useState } from 'react';
import { reportApi } from '../api/reportApi';
import { getReportData } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

const OwnerDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportApi.getSummary();
      setReport(getReportData(response));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Rapor verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return <Loading text="Owner dashboard yükleniyor..." />;
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Owner Dashboard"
          subtitle="İşletme raporları ve özet metrikler."
        />
        <EmptyState title="Rapor alınamadı" description={error} />
      </div>
    );
  }

  const { summary, topProducts, categoryBreakdown, tableBreakdown, recentOrders } = report;

  return (
    <div>
      <PageHeader
        title="Owner Dashboard"
        subtitle="İşletmenin genel performansını ve satış dağılımlarını takip et."
      />

      <div style={styles.statsGrid}>
        <SummaryCard title="Toplam Sipariş" value={summary.totalOrders} icon="🧾" />
        <SummaryCard title="Toplam Gelir" value={`${summary.totalRevenue} TL`} icon="💰" />
        <SummaryCard title="Ortalama Sipariş" value={`${summary.averageOrderValue} TL`} icon="📈" />
        <SummaryCard title="Aktif Sipariş" value={summary.activeOrders} icon="🔥" />
      </div>

      <div style={styles.gridTwo}>
        <Card>
          <CardBody>
            <h2 style={styles.sectionTitle}>Durum Dağılımı</h2>

            <div style={styles.list}>
              <StatusRow label="Alındı" value={summary.statusCounts.received} variant="primary" />
              <StatusRow label="Hazırlanıyor" value={summary.statusCounts.preparing} variant="warning" />
              <StatusRow label="Hazır" value={summary.statusCounts.ready} variant="success" />
              <StatusRow label="Teslim Edildi" value={summary.statusCounts.delivered} variant="default" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 style={styles.sectionTitle}>En Çok Satan Ürünler</h2>

            {topProducts.length === 0 ? (
              <EmptyState title="Veri yok" description="Henüz satış verisi oluşmadı." />
            ) : (
              <div style={styles.list}>
                {topProducts.map((product, index) => (
                  <div key={product.name} style={styles.row}>
                    <div>
                      <strong>{index + 1}. {product.name}</strong>
                      <p style={styles.muted}>{product.revenue} TL gelir</p>
                    </div>
                    <Badge variant="primary">{product.quantity} adet</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div style={styles.gridTwo}>
        <Card>
          <CardBody>
            <h2 style={styles.sectionTitle}>Kategori Bazlı Satış</h2>

            {categoryBreakdown.length === 0 ? (
              <EmptyState title="Veri yok" description="Henüz kategori bazlı satış oluşmadı." />
            ) : (
              <div style={styles.list}>
                {categoryBreakdown.map((item) => (
                  <div key={item.category} style={styles.row}>
                    <div>
                      <strong>{item.category}</strong>
                      <p style={styles.muted}>{item.revenue} TL gelir</p>
                    </div>
                    <Badge>{item.quantity} adet</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 style={styles.sectionTitle}>Masa Bazlı Yoğunluk</h2>

            {tableBreakdown.length === 0 ? (
              <EmptyState title="Veri yok" description="Henüz masa bazlı sipariş oluşmadı." />
            ) : (
              <div style={styles.list}>
                {tableBreakdown.map((item) => (
                  <div key={item.tableNumber} style={styles.row}>
                    <strong>Masa {item.tableNumber}</strong>
                    <Badge variant="success">{item.orderCount} sipariş</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card style={{ marginTop: '20px' }}>
        <CardBody>
          <h2 style={styles.sectionTitle}>Son Siparişler</h2>

          {recentOrders.length === 0 ? (
            <EmptyState title="Sipariş yok" description="Henüz sipariş verisi bulunmuyor." />
          ) : (
            <div style={styles.list}>
              {recentOrders.map((order) => (
                <div key={order._id} style={styles.row}>
                  <div>
                    <strong>Masa {order.tableNumber}</strong>
                    <p style={styles.muted}>
                      {order.customer?.name || 'Bilinmeyen müşteri'} · {new Date(order.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge variant="primary">{order.orderStatus}</Badge>
                    <p style={styles.muted}>{order.totalPrice} TL</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => {
  return (
    <Card>
      <CardBody>
        <div style={styles.statTop}>
          <span style={styles.statIcon}>{icon}</span>
          <strong style={styles.statValue}>{value}</strong>
        </div>
        <p style={styles.statTitle}>{title}</p>
      </CardBody>
    </Card>
  );
};

const StatusRow = ({ label, value, variant }) => {
  return (
    <div style={styles.row}>
      <strong>{label}</strong>
      <Badge variant={variant}>{value}</Badge>
    </div>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    width: '42px',
    height: '42px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    background: '#f1f5f9',
    fontSize: '22px',
  },
  statValue: {
    fontSize: '24px',
    color: '#8b5e3c',
  },
  statTitle: {
    marginTop: '10px',
    color: '#64748b',
    fontWeight: 700,
  },
  sectionTitle: {
    marginBottom: '14px',
  },
  list: {
    display: 'grid',
    gap: '12px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0',
  },
  muted: {
    color: '#64748b',
  },
};

export default OwnerDashboard;