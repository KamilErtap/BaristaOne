import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import MenuDetail from './pages/MenuDetail';
import TableMenu from './pages/TableMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import PrivacyPolicy from './pages/PrivacyPolicy';

import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminMenuCreate from './pages/AdminMenuCreate';
import AdminMenuDetail from './pages/AdminMenuDetail';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';
import AdminTables from './pages/AdminTables';
import AdminEventLogs from './pages/AdminEventLogs';
import KitchenScreen from './pages/KitchenScreen';
import WaiterScreen from './pages/WaiterScreen';
import OwnerDashboard from './pages/OwnerDashboard';

const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  KITCHEN: 'kitchen',
  WAITER: 'waiter',
  CUSTOMER: 'customer',
};

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/table/:tableCode/menu" element={<TableMenu />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
              <AdminLayout>
                <OwnerDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminMenu />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/new"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminMenuCreate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminMenuDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminCategories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminTables />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/event-logs"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
              <AdminLayout>
                <AdminEventLogs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/kitchen"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.KITCHEN]}>
              <AdminLayout>
                <KitchenScreen />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/waiter"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER, ROLES.WAITER]}>
              <AdminLayout>
                <WaiterScreen />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </Router>
  );
}

export default App;