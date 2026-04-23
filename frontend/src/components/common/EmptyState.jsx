const EmptyState = ({ title = 'Kayıt bulunamadı', description }) => {
  return (
    <div className="empty-box">
      <strong>{title}</strong>
      {description && <p style={{ marginTop: '6px' }}>{description}</p>}
    </div>
  );
};

export default EmptyState;