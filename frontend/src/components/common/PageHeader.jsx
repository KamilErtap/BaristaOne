const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div style={styles.wrapper}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {actions && <div style={styles.actions}>{actions}</div>}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
};

export default PageHeader;