import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

const testItem = {
  _id: '1',
  name: 'Latte',
  price: 120,
  image: 'https://example.com/latte.jpg',
};

const TestComponent = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <div>
      <button onClick={() => addToCart(testItem)}>Sepete Ekle</button>
      <button onClick={() => removeFromCart(testItem._id)}>Sepetten Sil</button>

      <p>Ürün Sayısı: {cart.length}</p>
      <p>Toplam Adet: {totalItems}</p>
      <p>Toplam Tutar: {totalPrice}</p>
      <p>İlk Ürün Adedi: {cart[0]?.quantity || 0}</p>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('sepete ürün ekler', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Sepete Ekle'));

    expect(screen.getByText('Ürün Sayısı: 1')).toBeInTheDocument();
    expect(screen.getByText('Toplam Adet: 1')).toBeInTheDocument();
    expect(screen.getByText('Toplam Tutar: 120')).toBeInTheDocument();
    expect(screen.getByText('İlk Ürün Adedi: 1')).toBeInTheDocument();
  });

  test('aynı ürün tekrar eklenince adet artırır', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Sepete Ekle'));
    fireEvent.click(screen.getByText('Sepete Ekle'));

    expect(screen.getByText('Ürün Sayısı: 1')).toBeInTheDocument();
    expect(screen.getByText('Toplam Adet: 2')).toBeInTheDocument();
    expect(screen.getByText('Toplam Tutar: 240')).toBeInTheDocument();
    expect(screen.getByText('İlk Ürün Adedi: 2')).toBeInTheDocument();
  });

  test('ürünü sepetten siler', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Sepete Ekle'));
    fireEvent.click(screen.getByText('Sepetten Sil'));

    expect(screen.getByText('Ürün Sayısı: 0')).toBeInTheDocument();
    expect(screen.getByText('Toplam Adet: 0')).toBeInTheDocument();
    expect(screen.getByText('Toplam Tutar: 0')).toBeInTheDocument();
    expect(screen.getByText('İlk Ürün Adedi: 0')).toBeInTheDocument();
  });
});