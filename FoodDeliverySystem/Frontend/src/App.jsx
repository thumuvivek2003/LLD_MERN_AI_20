import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext.jsx';
import { CartProvider } from './core/context/CartContext.jsx';
import { OrderProvider } from './core/context/OrderContext.jsx';
import { AppRouter } from './router/index.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppRouter />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
