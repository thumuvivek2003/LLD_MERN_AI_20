import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './app/providers/QueryProvider.jsx';
import { ThemeProvider } from './app/providers/ThemeProvider.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
