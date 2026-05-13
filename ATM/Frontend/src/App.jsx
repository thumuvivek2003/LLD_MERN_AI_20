import { Routes, Route, Navigate } from 'react-router-dom';
import ATMFrame from './components/ATMFrame.jsx';
import { useATM } from './context/ATMContext.jsx';

import IdleScreen from './screens/IdleScreen.jsx';
import BankDetectedScreen from './screens/BankDetectedScreen.jsx';
import EnterPinScreen from './screens/EnterPinScreen.jsx';
import WrongPinScreen from './screens/WrongPinScreen.jsx';
import PinBlockedScreen from './screens/PinBlockedScreen.jsx';
import AuthSuccessScreen from './screens/AuthSuccessScreen.jsx';
import SelectOperationScreen from './screens/SelectOperationScreen.jsx';
import CheckBalanceScreen from './screens/CheckBalanceScreen.jsx';
import EnterAmountScreen from './screens/EnterAmountScreen.jsx';
import VerifyAmountScreen from './screens/VerifyAmountScreen.jsx';
import ProcessingScreen from './screens/ProcessingScreen.jsx';
import CashPreparingScreen from './screens/CashPreparingScreen.jsx';
import DispensePreviewScreen from './screens/DispensePreviewScreen.jsx';
import CollectCashScreen from './screens/CollectCashScreen.jsx';
import TransactionCompleteScreen from './screens/TransactionCompleteScreen.jsx';
import SessionEndScreen from './screens/SessionEndScreen.jsx';

function ATMPage() {
  const { atmState } = useATM();

  const renderScreen = () => {
    switch (atmState) {
      case 'IDLE':
        return <IdleScreen />;
      case 'BANK_DETECTED':
        return <BankDetectedScreen />;
      case 'ENTER_PIN':
        return <EnterPinScreen />;
      case 'WRONG_PIN':
        return <WrongPinScreen />;
      case 'PIN_BLOCKED':
        return <PinBlockedScreen />;
      case 'AUTH_SUCCESS':
        return <AuthSuccessScreen />;
      case 'SELECT_OPERATION':
        return <SelectOperationScreen />;
      case 'CHECK_BALANCE':
        return <CheckBalanceScreen />;
      case 'ENTER_AMOUNT':
        return <EnterAmountScreen />;
      case 'VERIFY_AMOUNT':
        return <VerifyAmountScreen />;
      case 'PROCESSING':
        return <ProcessingScreen />;
      case 'CASH_PREPARING':
        return <CashPreparingScreen />;
      case 'DISPENSE_PREVIEW':
        return <DispensePreviewScreen />;
      case 'COLLECT_CASH':
        return <CollectCashScreen />;
      case 'TRANSACTION_COMPLETE':
        return <TransactionCompleteScreen />;
      case 'SESSION_END':
        return <SessionEndScreen />;
      default:
        return <IdleScreen />;
    }
  };

  return <ATMFrame>{renderScreen()}</ATMFrame>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ATMPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
