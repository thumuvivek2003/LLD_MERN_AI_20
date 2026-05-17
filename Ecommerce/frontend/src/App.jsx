import { BrowserRouter } from 'react-router-dom';
import AppProvider from './shared/context/AppProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}
