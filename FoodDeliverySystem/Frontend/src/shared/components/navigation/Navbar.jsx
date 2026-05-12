import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../core/context/AuthContext.jsx';
import { useCartContext } from '../../../core/context/CartContext.jsx';

export const Navbar = ({ showCart = false }) => {
  const { user, logout } = useAuthContext();
  const { cart } = useCartContext();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="font-bold text-xl text-brand">Foodie</span>
        </Link>
        <div className="flex items-center gap-3">
          {showCart && (
            <Link to="/customer/cart" className="relative btn-ghost">
              🛒 Cart
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-semibold">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">Logout</button>
        </div>
      </div>
    </header>
  );
};
