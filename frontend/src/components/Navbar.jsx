import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navWrapper}>
      <div style={styles.navInner}>
        <Link to="/" style={styles.brand}>
          ☕ BaristaOne
        </Link>

        <div style={styles.links}>
          <Link to="/menu" style={styles.link}>Menü</Link>

          {userInfo && userInfo.user.role === 'customer' && (
            <Link to="/orders" style={styles.link}>Siparişlerim</Link>
          )}

          {userInfo && userInfo.user.role === 'admin' && (
            <>
              <Link to="/admin/menu" style={styles.link}>Menü Yönetimi</Link>
              <Link to="/admin/orders" style={styles.link}>Sipariş Yönetimi</Link>
            </>
          )}

          {!userInfo ? (
            <>
              <Link to="/login" style={styles.authButton}>
                Giriş
              </Link>
              <Link to="/register" style={styles.primaryButton}>
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              <span style={styles.userBadge}>
                {userInfo.user.name} · {userInfo.user.role}
              </span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Çıkış
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navWrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(10px)',
    background: 'rgba(255,255,255,0.85)',
    borderBottom: '1px solid #e2e8f0',
  },
  navInner: {
    width: 'min(1200px, calc(100% - 32px))',
    margin: '0 auto',
    minHeight: '72px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  brand: {
    fontWeight: 800,
    fontSize: '22px',
    color: '#8b5e3c',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#334155',
    fontWeight: 500,
  },
  authButton: {
    padding: '10px 14px',
    borderRadius: '12px',
    background: '#f1f5f9',
    fontWeight: 600,
  },
  primaryButton: {
    padding: '10px 14px',
    borderRadius: '12px',
    background: '#8b5e3c',
    color: '#fff',
    fontWeight: 600,
  },
  userBadge: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 12px',
    borderRadius: '999px',
    color: '#475569',
    fontSize: '14px',
  },
  logoutButton: {
    background: '#dc2626',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '12px',
  },
};

export default Navbar;