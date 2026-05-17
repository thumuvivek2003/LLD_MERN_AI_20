import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { AuthProvider } from './app/providers/AuthProvider.jsx';
import { QueryProvider } from './app/providers/QueryProvider.jsx';
import { AppRouter } from './app/router/AppRouter.jsx';

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
