import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tableApi } from '../api/tableApi';
import { getTable } from '../api/responseHelpers';
import { useCart } from '../context/CartContext';

import Menu from './Menu';
import PageHeader from '../components/common/PageHeader';
import Card, { CardBody } from '../components/common/Card';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const TableMenu = () => {
  const { tableCode } = useParams();
  const { selectedTable, setSelectedTable } = useCart();

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTable = async () => {
    try {
      setLoading(true);

      const response = await tableApi.getTableByCode(tableCode);
      const foundTable = getTable(response);

      setTable(foundTable);
      setSelectedTable(foundTable);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Masa bilgisi alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [tableCode]);

  if (loading) {
    return <Loading text="Masa bilgisi yükleniyor..." />;
  }

  if (error || !table) {
    return (
      <div className="page-container">
        <PageHeader
          title="Masa Menüsü"
          subtitle="Masa bilgisi alınamadı."
        />

        <EmptyState
          title="Masa bulunamadı"
          description={error || 'Geçersiz masa kodu.'}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-container" style={{ marginBottom: '0' }}>
        <Card style={{ marginBottom: '18px' }}>
          <CardBody>
            <div style={styles.topRow}>
              <div>
                <h2 style={{ marginBottom: '6px' }}>
                  Masa {table.number}
                </h2>
                <p style={styles.muted}>
                  Kod: {table.code} · Kapasite: {table.capacity}
                </p>
                <p style={styles.muted}>
                  {table.description || 'Bu masa için açıklama bulunmuyor.'}
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={() => setSelectedTable(table)}
              >
                Bu Masayı Kullan
              </Button>
            </div>

            {selectedTable?.code === table.code && (
              <p className="message success" style={{ marginTop: '12px' }}>
                Siparişler bu masa için oluşturulacak.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Menu />
    </div>
  );
};

const styles = {
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  muted: {
    color: '#64748b',
  },
};

export default TableMenu;