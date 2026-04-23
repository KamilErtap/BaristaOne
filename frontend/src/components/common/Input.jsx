const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  disabled = false,
}) => {
  return (
    <label style={styles.wrapper}>
      {label && <span style={styles.label}>{label}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        disabled={disabled}
      />
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

export default Input;