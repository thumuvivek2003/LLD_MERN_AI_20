import AppRouter from './app/router/AppRouter.jsx';
import { AuthProvider } from './app/providers/AuthProvider.jsx';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { QueryProvider } from './app/providers/QueryProvider.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <AppRouter />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
