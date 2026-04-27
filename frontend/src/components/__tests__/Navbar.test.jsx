import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userInfo: null,
    logout: vi.fn(),
  }),
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    totalItems: 0,
  }),
}));

describe('Navbar', () => {
  test('giriş yapılmamış kullanıcı için temel linkleri gösterir', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/BaristaOne/i)).toBeInTheDocument();
    expect(screen.getByText(/Menü/i)).toBeInTheDocument();
    expect(screen.getByText(/Giriş Yap/i)).toBeInTheDocument();
    expect(screen.getByText(/Kayıt Ol/i)).toBeInTheDocument();
  });
});