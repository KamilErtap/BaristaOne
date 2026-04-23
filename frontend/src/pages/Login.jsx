import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { getAuthPayload } from '../api/responseHelpers';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
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
      const response = await authApi.login(form);

      login(response);

      const responseData = getAuthPayload(response);
      const user = responseData.user;

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    }
  };

  return (
    <div className="page-container" style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div className="card-body">
          <h1 className="page-title">Giriş Yap</h1>
          <p className="page-subtitle">
            Hesabına gir ve sipariş akışına devam et.
          </p>

          <form onSubmit={handleSubmit} className="form-stack">
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
              Giriş Yap
            </button>
          </form>

          {error && <p className="message error">{error}</p>}

          <p style={styles.footerText}>
            Hesabın yok mu? <Link to="/register" style={styles.link}>Kayıt ol</Link>
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

export default Login;