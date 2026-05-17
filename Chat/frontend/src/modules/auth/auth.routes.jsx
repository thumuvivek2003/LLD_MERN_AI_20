import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.jsx';
import { OtpVerifyPage } from './pages/OtpVerifyPage.jsx';

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="verify" element={<OtpVerifyPage />} />
    </Routes>
  );
}
