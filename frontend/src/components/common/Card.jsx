const Card = ({ children, style }) => {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, style }) => {
  return (
    <div className="card-body" style={style}>
      {children}
    </div>
  );
};

export default Card;