import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import MenuDetail from './pages/MenuDetail';
import AdminMenuDetail from './pages/AdminMenuDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenuCreate from './pages/AdminMenuCreate';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminMenu />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/new"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminMenuCreate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminMenuDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminCategories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;