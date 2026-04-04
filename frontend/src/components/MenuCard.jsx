import { Link } from 'react-router-dom';

const MenuCard = ({ item, onAddToCart }) => {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          style={styles.image}
        />
      ) : (
        <div style={styles.placeholder}>Görsel Yok</div>
      )}

      <div className="card-body" style={styles.body}>
        <div style={styles.topRow}>
          <span className="badge">{item.category}</span>
          <span className="badge">
            {item.isAvailable ? 'Müsait' : 'Tükendi'}
          </span>
        </div>

        <div>
          <h3 style={styles.title}>{item.name}</h3>
          <p style={styles.description}>{item.description}</p>
        </div>

        <div style={styles.bottom}>
          <strong style={styles.price}>{item.price} TL</strong>

          <div className="row-wrap">
            <Link to={`/menu/${item._id}`} className="btn-secondary" style={styles.linkBtn}>
              Detay
            </Link>

            <button
              onClick={() => onAddToCart(item)}
              disabled={!item.isAvailable}
              className="btn-primary"
              style={{ opacity: item.isAvailable ? 1 : 0.6 }}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    height: '180px',
    display: 'grid',
    placeItems: 'center',
    background: '#e2e8f0',
    color: '#64748b',
    fontWeight: 600,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '220px',
    justifyContent: 'space-between',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  description: {
    color: '#64748b',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: '20px',
    color: '#8b5e3c',
  },
  linkBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default MenuCard;