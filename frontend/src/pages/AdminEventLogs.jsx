import { useEffect, useMemo, useState } from 'react';
import { eventLogApi } from '../api/eventLogApi';
import { getEventLogs } from '../api/responseHelpers';

import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';

const AdminEventLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    eventType: '',
    orderId: '',
    tableNumber: '',
    sort: 'newest',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const response = await eventLogApi.getEventLogs(filters);
      setLogs(getEventLogs(response));

      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Event log kayıtları alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      eventType: '',
      orderId: '',
      tableNumber: '',
      sort: 'newest',
    });
    setMessage('Filtreler temizlendi');
  };

  const stats = useMemo(() => {
    const total = logs.length;
    const orderCreated = logs.filter(
      (log) => log.eventType === 'ORDER_CREATED'
    ).length;

    const uniqueTables = new Set(
      logs
        .map((log) => log.tableNumber)
        .filter((tableNumber) => tableNumber !== undefined && tableNumber !== null)
    ).size;

    const totalRevenue = logs.reduce((sum, log) => {
      return sum + (log.totalPrice || 0);
    }, 0);

    return {
      total,
      orderCreated,
      uniqueTables,
      totalRevenue,
    };
  }, [logs]);

  if (loading) {
    return <Loading text="Event log kayıtları yükleniyor..." />;
  }

  return (
    <div>
      <PageHeader
        title="Event Logs"
        subtitle="RabbitMQ worker tarafından işlenen sipariş event kayıtlarını takip et."
        actions={
          <Button variant="secondary" onClick={fetchLogs}>
            Yenile
          </Button>
        }
      />

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div style={styles.statsGrid}>
        <StatCard title="Toplam Log" value={stats.total} icon="📜" />
        <StatCard title="Order Created" value={stats.orderCreated} icon="🧾" />
        <StatCard title="Masa Sayısı" value={stats.uniqueTables} icon="🪑" />
        <StatCard title="Toplam Tutar" value={`${stats.totalRevenue} TL`} icon="💰" />
      </div>

      <Card style={{ marginTop: '20px' }}>
        <CardBody>
          <div className="admin-filter-box">
            <Select
              label="Event Type"
              name="eventType"
              value={filters.eventType}
              onChange={handleFilterChange}
            >
              <option value="">Tüm Eventler</option>
              <option value="ORDER_CREATED">ORDER_CREATED</option>
            </Select>

            <Select
              label="Sıralama"
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="table_asc">Masa No Artan</option>
              <option value="table_desc">Masa No Azalan</option>
            </Select>

            <Input
              label="Masa No"
              name="tableNumber"
              type="number"
              min="1"
              placeholder="Örn: 4"
              value={filters.tableNumber}
              onChange={handleFilterChange}
            />
          </div>

          <Input
            label="Order ID"
            name="orderId"
            placeholder="Sipariş ID ile filtrele"
            value={filters.orderId}
            onChange={handleFilterChange}
          />

          <div style={styles.filterActions}>
            <Button variant="secondary" onClick={clearFilters}>
              Filtreleri Temizle
            </Button>
          </div>
        </CardBody>
      </Card>

      <div style={styles.list}>
        {!error && logs.length === 0 ? (
          <EmptyState
            title="Event log bulunamadı"
            description="Sipariş oluşturulduğunda worker log kayıtları burada görünecek."
          />
        ) : (
          logs.map((log) => (
            <EventLogCard key={log._id} log={log} />
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
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

const EventLogCard = ({ log }) => {
  const orderId =
    typeof log.orderId === 'object'
      ? log.orderId?._id
      : log.orderId;

  const customerName =
    typeof log.customerId === 'object'
      ? log.customerId?.name
      : null;

  const customerEmail =
    typeof log.customerId === 'object'
      ? log.customerId?.email
      : null;

  return (
    <Card>
      <CardBody>
        <div style={styles.logHeader}>
          <div>
            <div style={styles.titleRow}>
              <h3 style={{ margin: 0 }}>
                Masa {log.tableNumber || '-'}
              </h3>

              <Badge variant="primary">
                {log.eventType || 'UNKNOWN_EVENT'}
              </Badge>
            </div>

            <p style={styles.muted}>
              {log.createdAt
                ? new Date(log.createdAt).toLocaleString('tr-TR')
                : 'Tarih yok'}
            </p>
          </div>

          <div style={styles.totalBox}>
            <span>Toplam</span>
            <strong>{log.totalPrice || 0} TL</strong>
          </div>
        </div>

        <div style={styles.infoGrid}>
          <InfoBox
            title="Order ID"
            value={orderId || 'Sipariş ID yok'}
          />

          <InfoBox
            title="Customer"
            value={
              customerName
                ? `${customerName}${customerEmail ? ` · ${customerEmail}` : ''}`
                : log.customerId || 'Müşteri bilgisi yok'
            }
          />

          <InfoBox
            title="Processed At"
            value={
              log.processedAt
                ? new Date(log.processedAt).toLocaleString('tr-TR')
                : 'Processed bilgisi yok'
            }
          />
        </div>
      </CardBody>
    </Card>
  );
};

const InfoBox = ({ title, value }) => {
  return (
    <div style={styles.infoBox}>
      <strong>{title}</strong>
      <p style={styles.muted}>{value}</p>
    </div>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: '26px',
    color: '#8b5e3c',
  },
  statTitle: {
    marginTop: '10px',
    color: '#64748b',
    fontWeight: 700,
  },
  filterActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  list: {
    display: 'grid',
    gap: '16px',
    marginTop: '20px',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  titleRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  totalBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '12px 16px',
    display: 'grid',
    gap: '4px',
    minWidth: '140px',
    textAlign: 'right',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginTop: '16px',
  },
  infoBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '14px',
    minWidth: 0,
    wordBreak: 'break-word',
  },
  muted: {
    color: '#64748b',
  },
};

export default AdminEventLogs;