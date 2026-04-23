const Checkbox = ({
  label,
  description,
  name,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      style={{
        ...styles.wrapper,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={styles.input}
      />

      <span
        style={{
          ...styles.box,
          ...(checked ? styles.boxChecked : {}),
        }}
      >
        {checked && <span style={styles.dot} />}
      </span>

      <span style={styles.texts}>
        {label && <strong style={styles.label}>{label}</strong>}
        {description && <span style={styles.description}>{description}</span>}
      </span>
    </label>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    background: '#f8fafc',
  },
  input: {
    display: 'none',
  },
  box: {
    width: '20px',
    height: '20px',
    minWidth: '20px',
    borderRadius: '8px',
    border: '2px solid #cbd5e1',
    background: '#fff',
    display: 'grid',
    placeItems: 'center',
    marginTop: '2px',
    transition: '0.2s ease',
  },
  boxChecked: {
    background: '#8b5e3c',
    borderColor: '#8b5e3c',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    background: '#fff',
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    color: '#0f172a',
    fontSize: '15px',
  },
  description: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: 1.5,
  },
};

export default Checkbox;