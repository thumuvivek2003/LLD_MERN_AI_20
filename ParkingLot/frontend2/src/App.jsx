import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './app/providers/QueryProvider.jsx';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { AuthProvider } from './app/providers/AuthProvider.jsx';
import { AppRouter } from './app/router/AppRouter.jsx';

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
