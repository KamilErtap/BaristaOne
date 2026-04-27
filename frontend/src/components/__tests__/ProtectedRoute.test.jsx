import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userInfo: {
      user: {
        role: 'admin',
      },
    },
    loading: false,
  }),
}));

describe('ProtectedRoute', () => {
  test('izinli kullanıcı için child component render eder', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['admin']}>
          <div>Korunan İçerik</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Korunan İçerik')).toBeInTheDocument();
  });
});