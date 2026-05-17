import { AuthProvider } from '../../modules/auth/store/auth.store.js';
import { CartProvider } from '../../modules/cart/store/cart.store.js';

export default function AppProvider({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
