const Select = ({
  label,
  name,
  value,
  onChange,
  children,
  disabled = false,
}) => {
  return (
    <label style={styles.wrapper}>
      {label && <span style={styles.label}>{label}</span>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {children}
      </select>
    </label>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
};

export default Select;