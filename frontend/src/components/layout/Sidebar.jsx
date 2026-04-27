import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { userInfo } = useAuth();

  const role = userInfo?.user?.role;

  const allLinks = [
    {
      label: 'Admin Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
      roles: ['admin'],
    },
    {
      label: 'Owner Dashboard',
      path: '/owner/dashboard',
      icon: '👑',
      roles: ['owner'],
    },
    {
      label: 'Menü Yönetimi',
      path: '/admin/menu',
      icon: '☕',
      roles: ['admin', 'owner'],
    },
    {
      label: 'Kategoriler',
      path: '/admin/categories',
      icon: '🗂️',
      roles: ['admin', 'owner'],
    },
    {
      label: 'Masalar',
      path: '/admin/tables',
      icon: '🪑',
      roles: ['admin', 'owner'],
    },
    {
      label: 'Kitchen',
      path: '/admin/kitchen',
      icon: '👨‍🍳',
      roles: ['admin', 'owner', 'kitchen'],
    },
    {
      label: 'Waiter',
      path: '/admin/waiter',
      icon: '🧑‍🍽️',
      roles: ['admin', 'owner', 'waiter'],
    },
    {
      label: 'Sipariş Yönetimi',
      path: '/admin/orders',
      icon: '🧾',
      roles: ['admin', 'owner'],
    },
    {
      label: 'Event Logs',
      path: '/admin/event-logs',
      icon: '📜',
      roles: ['admin', 'owner'],
    },
  ];

  const links = allLinks.filter((link) => link.roles.includes(role));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoBox}>
        <div style={styles.logo}>B1</div>
        <div>
          <h2 style={styles.title}>BaristaOne</h2>
          <p style={styles.subtitle}>Control Panel</p>
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