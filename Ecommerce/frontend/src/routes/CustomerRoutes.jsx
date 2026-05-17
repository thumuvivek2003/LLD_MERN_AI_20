import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/customer/CustomerLayout.jsx';
import ProductListPage from '../modules/product/pages/ProductListPage.jsx';
import ProductDetailsPage from '../modules/product/pages/ProductDetailsPage.jsx';
import CartPage from '../modules/cart/pages/CartPage.jsx';
import CheckoutPage from '../modules/checkout/pages/CheckoutPage.jsx';
import OrdersPage from '../modules/order/pages/OrdersPage.jsx';
import OrderDetailsPage from '../modules/order/pages/OrderDetailsPage.jsx';
import OrderSuccessPage from '../modules/order/pages/OrderSuccessPage.jsx';
import ProfilePage from '../modules/auth/pages/ProfilePage.jsx';

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/success/:id" element={<OrderSuccessPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
