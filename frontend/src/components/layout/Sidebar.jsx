import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
    },
    {
      label: 'Menü Yönetimi',
      path: '/admin/menu',
      icon: '☕',
    },
    {
      label: 'Kategoriler',
      path: '/admin/categories',
      icon: '🗂️',
    },
    {
      label: 'Sipariş Yönetimi',
      path: '/admin/orders',
      icon: '🧾',
    },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoBox}>
        <div style={styles.logo}>B1</div>
        <div>
          <h2 style={styles.title}>BaristaOne</h2>
          <p style={styles.subtitle}>Admin Panel</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    minHeight: 'calc(100vh - 72px)',
    background: '#111827',
    color: '#fff',
    padding: '20px',
    position: 'sticky',
    top: '72px',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
  },
  logo: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    background: '#8b5e3c',
    color: '#fff',
    fontWeight: 800,
  },
  title: {
    fontSize: '18px',
    lineHeight: 1.1,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '13px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '14px',
    color: '#d1d5db',
    fontWeight: 600,
    transition: '0.2s ease',
  },
  activeLink: {
    background: '#8b5e3c',
    color: '#fff',
  },
};

export default Sidebar;