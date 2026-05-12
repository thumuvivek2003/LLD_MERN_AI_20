import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '../shared/components/navigation/Navbar.jsx';
import { BottomTab } from '../shared/components/navigation/BottomTab.jsx';
import { useCartContext } from '../core/context/CartContext.jsx';

const tabs = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/customer/cart', label: 'Cart', icon: '🛒' },
  { to: '/customer/orders', label: 'Orders', icon: '📦' },
];

export const CustomerLayout = () => {
  const { refresh } = useCartContext();
  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar showCart />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
      <BottomTab items={tabs} />
    </div>
  );
};
