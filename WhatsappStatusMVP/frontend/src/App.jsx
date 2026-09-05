// App.jsx — renderApplication(): providers → phone frame → router.
import { AppProviders } from './app/providers.jsx';
import { AppRouter } from './app/router.jsx';
import { PhoneFrame } from './layouts/PhoneFrame.jsx';

export default function App() {
  return (
    <AppProviders>
      <PhoneFrame>
        <AppRouter />
      </PhoneFrame>
    </AppProviders>
  );
}
