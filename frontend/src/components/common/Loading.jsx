const Loading = ({ text = 'Yükleniyor...' }) => {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-body">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;