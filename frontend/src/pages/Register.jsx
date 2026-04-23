import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authApi.register(form);
      login(response);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    }
  };

  return (
    <div className="page-container" style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div className="card-body">
          <h1 className="page-title">Kayıt Ol</h1>
          <p className="page-subtitle">
            Yeni bir hesap oluştur ve masaya sipariş gönder.
          </p>

          <form onSubmit={handleSubmit} className="form-stack">
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit" className="btn-primary">
              Kayıt Ol
            </button>
          </form>

          {error && <p className="message error">{error}</p>}

          <p style={styles.footerText}>
            Zaten hesabın var mı? <Link to="/login" style={styles.link}>Giriş yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    minHeight: 'calc(100vh - 120px)',
    display: 'grid',
    placeItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
  },
  footerText: {
    marginTop: '16px',
    color: '#64748b',
  },
  link: {
    color: '#8b5e3c',
    fontWeight: 700,
  },
};

export default Register;