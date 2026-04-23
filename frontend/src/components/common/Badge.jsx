const Badge = ({ children, variant = 'default' }) => {
  const colors = {
    default: {
      background: '#f1f5f9',
      color: '#64748b',
    },
    success: {
      background: '#dcfce7',
      color: '#166534',
    },
    warning: {
      background: '#fef3c7',
      color: '#92400e',
    },
    danger: {
      background: '#fee2e2',
      color: '#991b1b',
    },
    primary: {
      background: '#ede9fe',
      color: '#6d28d9',
    },
  };

  return (
    <span
      style={{
        ...styles.badge,
        ...colors[variant],
      }}
    >
      {children}
    </span>
  );
};

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 700,
  },
};

export default Badge;