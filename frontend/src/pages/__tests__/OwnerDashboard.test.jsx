import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OwnerDashboard from '../OwnerDashboard';

const mockGetSummary = vi.fn();

vi.mock('../../api/reportApi', () => ({
  reportApi: {
    getSummary: (...args) => mockGetSummary(...args),
  },
}));

vi.mock('../../api/responseHelpers', () => ({
  getReportData: (response) => response.data.data,
}));

describe('OwnerDashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('owner dashboard özet verileri render eder', async () => {
    mockGetSummary.mockResolvedValue({
      data: {
        data: {
          summary: {
            totalOrders: 12,
            totalRevenue: 1540,
            averageOrderValue: 128.33,
            activeOrders: 3,
            statusCounts: {
              received: 1,
              preparing: 1,
              ready: 1,
              delivered: 9,
            },
          },
          topProducts: [
            {
              name: 'Latte',
              quantity: 6,
              revenue: 720,
            },
            {
              name: 'Brownie',
              quantity: 4,
              revenue: 360,
            },
          ],
          categoryBreakdown: [
            {
              category: 'Kahve',
              quantity: 10,
              revenue: 1100,
            },
          ],
          tableBreakdown: [
            {
              tableNumber: 4,
              orderCount: 5,
            },
          ],
          recentOrders: [
            {
              _id: 'o1',
              tableNumber: 4,
              totalPrice: 240,
              orderStatus: 'received',
              customer: {
                name: 'Kamil',
                email: 'kamil@test.com',
              },
              createdAt: '2026-01-01T10:00:00.000Z',
            },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <OwnerDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Owner Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Toplam Sipariş/i)).toBeInTheDocument();
    expect(screen.getByText(/Toplam Gelir/i)).toBeInTheDocument();
    expect(screen.getByText(/Ortalama Sipariş/i)).toBeInTheDocument();
    expect(screen.getByText(/Aktif Sipariş/i)).toBeInTheDocument();

    expect(screen.getByText(/Latte/i)).toBeInTheDocument();
    expect(screen.getByText(/Brownie/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Kategori Bazlı Satış/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Masa Bazlı Yoğunluk/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Son Siparişler/i })).toBeInTheDocument();
  });

  test('owner dashboard report api çağrısını yapar', async () => {
    mockGetSummary.mockResolvedValue({
      data: {
        data: {
          summary: {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            activeOrders: 0,
            statusCounts: {
              received: 0,
              preparing: 0,
              ready: 0,
              delivered: 0,
            },
          },
          topProducts: [],
          categoryBreakdown: [],
          tableBreakdown: [],
          recentOrders: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <OwnerDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGetSummary).toHaveBeenCalled();
    });
  });

  test('veri boş olsa da dashboard temel bölümleri gösterir', async () => {
    mockGetSummary.mockResolvedValue({
      data: {
        data: {
          summary: {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            activeOrders: 0,
            statusCounts: {
              received: 0,
              preparing: 0,
              ready: 0,
              delivered: 0,
            },
          },
          topProducts: [],
          categoryBreakdown: [],
          tableBreakdown: [],
          recentOrders: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <OwnerDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Owner Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /Durum Dağılımı/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /En Çok Satan Ürünler/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Kategori Bazlı Satış/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Masa Bazlı Yoğunluk/i })).toBeInTheDocument();
  });
});