const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  style,
}) => {
  const className = `btn-${variant}`;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;