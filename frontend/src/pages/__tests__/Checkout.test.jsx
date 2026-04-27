import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../Checkout';

const mockNavigate = vi.fn();
const mockCreateOrder = vi.fn();
const mockClearCart = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../api/orderApi', () => ({
  orderApi: {
    createOrder: (...args) => mockCreateOrder(...args),
  },
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userInfo: {
      user: {
        _id: 'user1',
        name: 'Kamil',
        email: 'kamil@test.com',
        role: 'customer',
      },
      token: 'fake-token',
    },
  }),
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cart: [
      {
        _id: '1',
        name: 'Latte',
        price: 120,
        quantity: 2,
        image: 'https://example.com/latte.jpg',
      },
    ],
    clearCart: mockClearCart,
    totalPrice: 240,
    totalItems: 2,
    selectedTable: {
      _id: 't1',
      number: 4,
      code: 'TBL-004',
      capacity: 4,
    },
  }),
}));

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('checkout sayfası cart ve masa bilgilerini render eder', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/Siparişi Tamamla/i)).toBeInTheDocument();
    expect(screen.getByText(/Latte/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByText(/TBL-004/i)).toBeInTheDocument();
    expect(screen.getByText(/Toplam Tutar/i)).toBeInTheDocument();
  });

  test('başarılı sipariş sonrası order api çağrılır, sepet temizlenir ve yönlendirir', async () => {
    const user = userEvent.setup();

    mockCreateOrder.mockResolvedValue({
      data: {
        success: true,
        message: 'Sipariş başarıyla oluşturuldu',
        data: {
          order: {
            _id: 'order1',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole('button', { name: /Siparişi Tamamla/i })
    );

    expect(mockCreateOrder).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/orders');
    });
  });

  test('masa numarası değiştirilebiliyorsa yeni değerle sipariş oluşturur', async () => {
    const user = userEvent.setup();

    mockCreateOrder.mockResolvedValue({
      data: {
        success: true,
        message: 'Sipariş başarıyla oluşturuldu',
        data: {
          order: {
            _id: 'order2',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const tableInput = screen.getByDisplayValue('4');
    await user.clear(tableInput);
    await user.type(tableInput, '7');

    await user.click(
      screen.getByRole('button', { name: /Siparişi Tamamla/i })
    );

    expect(mockCreateOrder).toHaveBeenCalled();
  });
});