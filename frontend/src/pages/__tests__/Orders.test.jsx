import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Orders from '../Orders';

const mockGetMyOrders = vi.fn();

vi.mock('../../api/orderApi', () => ({
  orderApi: {
    getMyOrders: (...args) => mockGetMyOrders(...args),
  },
}));

vi.mock('../../api/responseHelpers', () => ({
  getOrders: (response) => response.data.data.orders,
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

describe('Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('siparişler sayfası sipariş listesini render eder', async () => {
    mockGetMyOrders.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              _id: 'o1',
              tableNumber: 4,
              totalPrice: 240,
              orderStatus: 'received',
              paymentStatus: 'paid',
              createdAt: '2026-01-01T10:00:00.000Z',
              items: [
                {
                  name: 'Latte',
                  quantity: 2,
                  price: 120,
                },
              ],
            },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Latte/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sipariş No:/i)).toBeInTheDocument();
    expect(screen.getByText(/Masa/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Alındı/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Ödendi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Toplam/i).length).toBeGreaterThan(0);
  });

  test('siparişler sayfası api çağrısını yapar', async () => {
    mockGetMyOrders.mockResolvedValue({
      data: {
        data: {
          orders: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGetMyOrders).toHaveBeenCalled();
    });
  });

  test('sipariş yoksa boş durum mesajı gösterir', async () => {
    mockGetMyOrders.mockResolvedValue({
      data: {
        data: {
          orders: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Henüz sipariş bulunmuyor/i)
      ).toBeInTheDocument();
    });
  });
});