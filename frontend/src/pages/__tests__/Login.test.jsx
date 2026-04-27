import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockAuthApiLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock('../../api/authApi', () => ({
  authApi: {
    login: (...args) => mockAuthApiLogin(...args),
  },
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('login form alanlarını render eder', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Giriş Yap/i })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Şifre/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Giriş Yap/i })
    ).toBeInTheDocument();
  });

  test('başarılı login sonrası login fonksiyonunu ve navigate çağrısını yapar', async () => {
    const user = userEvent.setup();

    mockAuthApiLogin.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'fake-token',
          user: {
            name: 'Kamil',
            email: 'kamil@test.com',
            role: 'customer',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Email/i), 'kamil@test.com');
    await user.type(screen.getByPlaceholderText(/Şifre/i), '123456');
    await user.click(screen.getByRole('button', { name: /Giriş Yap/i }));

    expect(mockAuthApiLogin).toHaveBeenCalledWith({
      email: 'kamil@test.com',
      password: '123456',
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });

  test('admin login sonrası admin dashboarda yönlendirir', async () => {
    const user = userEvent.setup();

    mockAuthApiLogin.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'fake-token',
          user: {
            name: 'Admin',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Email/i), 'admin@test.com');
    await user.type(screen.getByPlaceholderText(/Şifre/i), '123456');
    await user.click(screen.getByRole('button', { name: /Giriş Yap/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
  });

  test('owner login sonrası owner dashboarda yönlendirir', async () => {
    const user = userEvent.setup();

    mockAuthApiLogin.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'fake-token',
          user: {
            name: 'Owner',
            email: 'owner@test.com',
            role: 'owner',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Email/i), 'owner@test.com');
    await user.type(screen.getByPlaceholderText(/Şifre/i), '123456');
    await user.click(screen.getByRole('button', { name: /Giriş Yap/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/owner/dashboard');
  });

  test('kitchen login sonrası kitchen ekranına yönlendirir', async () => {
    const user = userEvent.setup();

    mockAuthApiLogin.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'fake-token',
          user: {
            name: 'Kitchen',
            email: 'kitchen@test.com',
            role: 'kitchen',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Email/i), 'kitchen@test.com');
    await user.type(screen.getByPlaceholderText(/Şifre/i), '123456');
    await user.click(screen.getByRole('button', { name: /Giriş Yap/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/kitchen');
  });

  test('waiter login sonrası waiter ekranına yönlendirir', async () => {
    const user = userEvent.setup();

    mockAuthApiLogin.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'fake-token',
          user: {
            name: 'Waiter',
            email: 'waiter@test.com',
            role: 'waiter',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Email/i), 'waiter@test.com');
    await user.type(screen.getByPlaceholderText(/Şifre/i), '123456');
    await user.click(screen.getByRole('button', { name: /Giriş Yap/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/waiter');
  });
});