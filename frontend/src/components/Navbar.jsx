import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();

  const role = userInfo?.user?.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderRolePanelLink = () => {
    if (role === 'admin') {
      return (
        <Link to="/admin/dashboard" style={styles.link}>
          Panel
        </Link>
      );
    }

    if (role === 'owner') {
      return (
        <Link to="/owner/dashboard" style={styles.link}>
          Owner
        </Link>
      );
    }

    if (role === 'kitchen') {
      return (
        <Link to="/admin/kitchen" style={styles.link}>
          Kitchen
        </Link>
      );
    }

    if (role === 'waiter') {
      return (
        <Link to="/admin/waiter" style={styles.link}>
          Waiter
        </Link>
      );
    }

    return null;
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/menu" style={styles.brand}>
          ☕ BaristaOne
        </Link>

        <nav style={styles.nav}>
          <Link to="/menu" style={styles.link}>
            Menü
          </Link>

          {renderRolePanelLink()}

          {role === 'customer' && (
            <>
              <Link to="/cart" style={styles.link}>
                Sepet ({totalItems})
              </Link>

              <Link to="/orders" style={styles.link}>
                Siparişlerim
              </Link>
            </>
          )}

          {!userInfo ? (
            <>
              <Link to="/login" style={styles.link}>
                Giriş Yap
              </Link>

              <Link to="/register" style={styles.link}>
                Kayıt Ol
              </Link>
            </>
          ) : (
            <div style={styles.userBox}>
              <span style={styles.userName}>
                {userInfo.user?.name} ({role})
              </span>

              <button onClick={handleLogout} style={styles.logoutButton}>
                Çıkış Yap
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  container: {
    width: 'min(1200px, calc(100% - 32px))',
    margin: '0 auto',
    minHeight: '72px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '12px 0',
  },
  brand: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#8b5e3c',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#334155',
    fontWeight: 600,
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  userName: {
    color: '#475569',
    fontWeight: 600,
  },
  logoutButton: {
    border: 'none',
    background: '#8b5e3c',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

export default Navbar;