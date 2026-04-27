import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Menu from '../Menu';

const mockGetMenuItems = vi.fn();
const mockGetCategories = vi.fn();

vi.mock('../../api/menuApi', () => ({
  menuApi: {
    getMenuItems: (...args) => mockGetMenuItems(...args),
    getCategories: (...args) => mockGetCategories(...args),
  },
}));

vi.mock('../../api/responseHelpers', () => ({
  getItems: (response) => response.data.data.items,
  getCategories: (response) => response.data.data.categories,
}));

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));

describe('Menu Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('menü sayfası ürünleri render eder', async () => {
    mockGetCategories.mockResolvedValue({
      data: {
        data: {
          categories: ['Kahve', 'Tatlı'],
        },
      },
    });

    mockGetMenuItems.mockResolvedValue({
      data: {
        data: {
          items: [
            {
              _id: '1',
              name: 'Latte',
              description: 'Sütlü kahve',
              price: 120,
              category: 'Kahve',
              image: 'https://example.com/latte.jpg',
              isAvailable: true,
            },
            {
              _id: '2',
              name: 'Brownie',
              description: 'Çikolatalı tatlı',
              price: 90,
              category: 'Tatlı',
              image: 'https://example.com/brownie.jpg',
              isAvailable: true,
            },
          ],
        },
      },
    });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    expect(screen.getByText(/Menü/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Latte')).toBeInTheDocument();
      expect(screen.getByText('Brownie')).toBeInTheDocument();
    });

    expect(screen.getByText(/Sütlü kahve/i)).toBeInTheDocument();
    expect(screen.getByText(/Çikolatalı tatlı/i)).toBeInTheDocument();
  });

  test('menü sayfası kategori ve ürün API çağrılarını yapar', async () => {
    mockGetCategories.mockResolvedValue({
      data: {
        data: {
          categories: ['Kahve'],
        },
      },
    });

    mockGetMenuItems.mockResolvedValue({
      data: {
        data: {
          items: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockGetCategories).toHaveBeenCalled();
      expect(mockGetMenuItems).toHaveBeenCalled();
    });
  });

  test('ürün yoksa boş durum mesajı gösterir', async () => {
    mockGetCategories.mockResolvedValue({
      data: {
        data: {
          categories: [],
        },
      },
    });

    mockGetMenuItems.mockResolvedValue({
      data: {
        data: {
          items: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/ürün bulunamadı/i)
      ).toBeInTheDocument();
    });
  });
});