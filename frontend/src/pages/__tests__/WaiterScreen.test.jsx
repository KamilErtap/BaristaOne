import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import WaiterScreen from '../WaiterScreen';

const mockGetAllOrders = vi.fn();
const mockUpdateOrderStatus = vi.fn();

vi.mock('../../api/orderApi', () => ({
  orderApi: {
    getAllOrders: (...args) => mockGetAllOrders(...args),
    updateOrderStatus: (...args) => mockUpdateOrderStatus(...args),
  },
}));

vi.mock('../../api/responseHelpers', () => ({
  getOrders: (response) => response.data.data.orders,
}));

describe('WaiterScreen Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('waiter ekranı hazır siparişleri ve istatistikleri render eder', async () => {
    mockGetAllOrders.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              _id: 'o1',
              tableNumber: 4,
              totalPrice: 240,
              orderStatus: 'ready',
              createdAt: '2026-01-01T10:00:00.000Z',
              customer: {
                name: 'Kamil',
              },
              items: [
                {
                  name: 'Latte',
                  quantity: 2,
                },
              ],
            },
            {
              _id: 'o2',
              tableNumber: 6,
              totalPrice: 180,
              orderStatus: 'ready',
              createdAt: '2026-01-01T10:05:00.000Z',
              customer: {
                name: 'Ayşe',
              },
              items: [
                {
                  name: 'Brownie',
                  quantity: 2,
                },
              ],
            },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <WaiterScreen />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Waiter Screen/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Bekleyen Masa/i)).toBeInTheDocument();
    expect(screen.getByText(/Toplam Tutar/i)).toBeInTheDocument();

    expect(screen.getByText(/Masa 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Masa 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Latte/i)).toBeInTheDocument();
    expect(screen.getByText(/Brownie/i)).toBeInTheDocument();
    expect(screen.getByText(/Kamil/i)).toBeInTheDocument();
    expect(screen.getByText(/Ayşe/i)).toBeInTheDocument();
  });

  test('teslim edildi butonu updateOrderStatus çağrısı yapar', async () => {
    const user = userEvent.setup();

    mockGetAllOrders.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              _id: 'o1',
              tableNumber: 4,
              totalPrice: 240,
              orderStatus: 'ready',
              createdAt: '2026-01-01T10:00:00.000Z',
              customer: {
                name: 'Kamil',
              },
              items: [
                {
                  name: 'Latte',
                  quantity: 2,
                },
              ],
            },
          ],
        },
      },
    });

    mockUpdateOrderStatus.mockResolvedValue({
      data: {
        success: true,
        message: 'Sipariş teslim edildi',
        data: {
          order: {
            _id: 'o1',
            orderStatus: 'delivered',
          },
        },
      },
    });

    render(
      <MemoryRouter>
        <WaiterScreen />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Masa 4/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Teslim Edildi/i }));

    expect(mockUpdateOrderStatus).toHaveBeenCalledWith('o1', 'delivered');
  });

  test('sıralama değişince getAllOrders tekrar çağrılır', async () => {
    const user = userEvent.setup();

    mockGetAllOrders.mockResolvedValue({
      data: {
        data: {
          orders: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <WaiterScreen />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGetAllOrders).toHaveBeenCalled();
    });

    const sortSelect = screen.getByDisplayValue(/Masa No Artan/i);
    await user.selectOptions(sortSelect, 'newest');

    await waitFor(() => {
      expect(mockGetAllOrders).toHaveBeenCalledTimes(2);
    });
  });
});