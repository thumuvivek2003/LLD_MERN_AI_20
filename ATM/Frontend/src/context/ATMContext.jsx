import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { atmApi } from '../api/atm.api.js';

/**
 * ATM states (string keys, mirrors the backend's state machine)
 *  - IDLE
 *  - BANK_DETECTED
 *  - ENTER_PIN
 *  - WRONG_PIN
 *  - PIN_BLOCKED
 *  - AUTH_SUCCESS
 *  - SELECT_OPERATION
 *  - CHECK_BALANCE
 *  - ENTER_AMOUNT
 *  - VERIFY_AMOUNT
 *  - PROCESSING
 *  - CASH_PREPARING
 *  - DISPENSE_PREVIEW
 *  - COLLECT_CASH
 *  - TRANSACTION_COMPLETE
 *  - SESSION_END
 */

const SESSION_TIMEOUT_SECONDS = 60;

const ATMContext = createContext(null);

export function ATMProvider({ children }) {
  const [atmState, setAtmState] = useState('IDLE');
  const [sessionId, setSessionId] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [bankInfo, setBankInfo] = useState(null); // { bankName, bankCode }
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [balance, setBalance] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [breakdown, setBreakdown] = useState([]); // [{ denomination, count }]
  const [total, setTotal] = useState(0);
  const [transactionId, setTransactionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Session countdown (only active after PIN success)
  const [secondsLeft, setSecondsLeft] = useState(SESSION_TIMEOUT_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  const resetAll = useCallback(() => {
    setAtmState('IDLE');
    setSessionId(null);
    setSelectedCard(null);
    setBankInfo(null);
    setPin('');
    setAttemptsLeft(3);
    setBalance(null);
    setWithdrawAmount('');
    setBreakdown([]);
    setTotal(0);
    setTransactionId(null);
    setErrorMessage('');
    setLoading(false);
    setTimerActive(false);
    setSecondsLeft(SESSION_TIMEOUT_SECONDS);
  }, []);

  // --- Session timer ---
  const resetTimer = useCallback(() => {
    setSecondsLeft(SESSION_TIMEOUT_SECONDS);
  }, []);

  useEffect(() => {
    if (!timerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return undefined;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timerActive]);

  useEffect(() => {
    if (!timerActive) return;
    if (secondsLeft === 0) {
      // Auto-eject on timeout
      (async () => {
        try {
          if (sessionId) await atmApi.ejectCard(sessionId);
        } catch (_) {
          // ignore
        }
        setTimerActive(false);
        setAtmState('SESSION_END');
      })();
    }
  }, [secondsLeft, timerActive, sessionId]);

  // --- Load cards on mount ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await atmApi.getCards();
        const list = Array.isArray(data) ? data : data?.cards || [];
        if (mounted) setCards(list);
      } catch (_) {
        if (mounted) setCards([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // --- Actions ---
  const insertCard = useCallback(async (cardNumber) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await atmApi.insertCard(cardNumber);
      setSessionId(data.sessionId);
      setBankInfo({ bankName: data.bankName, bankCode: data.bankCode });
      setSelectedCard(cardNumber);
      setAtmState('BANK_DETECTED');
      // After 1.5s move to PIN entry
      setTimeout(() => {
        setAtmState('ENTER_PIN');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitPin = useCallback(
    async (pinValue) => {
      if (!sessionId) return;
      setLoading(true);
      setErrorMessage('');
      try {
        const data = await atmApi.enterPin(sessionId, pinValue);
        // Success path
        setAtmState('AUTH_SUCCESS');
        setAttemptsLeft(3);
        setPin('');
        // Start session timer
        setSecondsLeft(SESSION_TIMEOUT_SECONDS);
        setTimerActive(true);
        setTimeout(() => {
          setAtmState('SELECT_OPERATION');
        }, 1000);
      } catch (err) {
        const left =
          typeof err.payload?.attemptsLeft === 'number'
            ? err.payload.attemptsLeft
            : Math.max(0, attemptsLeft - 1);
        setAttemptsLeft(left);
        setPin('');
        if (left <= 0 || err.payload?.blocked || err.status === 423) {
          setAtmState('PIN_BLOCKED');
        } else {
          setErrorMessage(err.message || 'Incorrect PIN');
          setAtmState('WRONG_PIN');
        }
      } finally {
        setLoading(false);
      }
    },
    [sessionId, attemptsLeft]
  );

  const goSelectOperation = useCallback(() => {
    setErrorMessage('');
    resetTimer();
    setAtmState('SELECT_OPERATION');
  }, [resetTimer]);

  const checkBalance = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    resetTimer();
    try {
      const data = await atmApi.getBalance(sessionId);
      setBalance(data.balance);
      setAtmState('CHECK_BALANCE');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, resetTimer]);

  const startWithdraw = useCallback(() => {
    setWithdrawAmount('');
    setErrorMessage('');
    resetTimer();
    setAtmState('ENTER_AMOUNT');
  }, [resetTimer]);

  const previewWithdraw = useCallback(
    async (amount) => {
      if (!sessionId) return;
      setLoading(true);
      setErrorMessage('');
      resetTimer();
      try {
        const data = await atmApi.withdrawPreview(sessionId, amount);
        setBreakdown(data.breakdown || []);
        setTotal(data.total ?? amount);
        setWithdrawAmount(String(amount));
        setAtmState('VERIFY_AMOUNT');
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, resetTimer]
  );

  const confirmWithdraw = useCallback(async () => {
    if (!sessionId) return;
    setErrorMessage('');
    resetTimer();
    setAtmState('PROCESSING');
    try {
      // Brief processing pause for UX
      await new Promise((r) => setTimeout(r, 900));
      setAtmState('CASH_PREPARING');
      const data = await atmApi.withdrawConfirm(sessionId, Number(withdrawAmount));
      setTransactionId(data.transactionId);
      setBreakdown(data.breakdown || breakdown);
      await new Promise((r) => setTimeout(r, 1100));
      setAtmState('DISPENSE_PREVIEW');
    } catch (err) {
      setErrorMessage(err.message);
      setAtmState('SELECT_OPERATION');
    }
  }, [sessionId, withdrawAmount, breakdown, resetTimer]);

  const collectCash = useCallback(async () => {
    if (!sessionId) return;
    resetTimer();
    setAtmState('COLLECT_CASH');
    try {
      await atmApi.collectCash(sessionId);
    } catch (_) {
      // ignore — UX continues
    }
  }, [sessionId, resetTimer]);

  const finishCollection = useCallback(() => {
    resetTimer();
    setAtmState('TRANSACTION_COMPLETE');
  }, [resetTimer]);

  const exitSession = useCallback(async () => {
    setTimerActive(false);
    try {
      if (sessionId) await atmApi.ejectCard(sessionId);
    } catch (_) {
      // ignore
    }
    setAtmState('SESSION_END');
  }, [sessionId]);

  const backToIdle = useCallback(() => {
    resetAll();
  }, [resetAll]);

  // Reset timer on any interaction inside ATM body
  const handleActivity = useCallback(() => {
    if (timerActive) resetTimer();
  }, [timerActive, resetTimer]);

  const value = useMemo(
    () => ({
      // state
      atmState,
      sessionId,
      cards,
      selectedCard,
      bankInfo,
      pin,
      attemptsLeft,
      balance,
      withdrawAmount,
      breakdown,
      total,
      transactionId,
      errorMessage,
      loading,
      timerActive,
      secondsLeft,
      // setters / pin entry
      setPin,
      setWithdrawAmount,
      setAtmState,
      // actions
      insertCard,
      submitPin,
      goSelectOperation,
      checkBalance,
      startWithdraw,
      previewWithdraw,
      confirmWithdraw,
      collectCash,
      finishCollection,
      exitSession,
      backToIdle,
      handleActivity,
      resetTimer
    }),
    [
      atmState,
      sessionId,
      cards,
      selectedCard,
      bankInfo,
      pin,
      attemptsLeft,
      balance,
      withdrawAmount,
      breakdown,
      total,
      transactionId,
      errorMessage,
      loading,
      timerActive,
      secondsLeft,
      insertCard,
      submitPin,
      goSelectOperation,
      checkBalance,
      startWithdraw,
      previewWithdraw,
      confirmWithdraw,
      collectCash,
      finishCollection,
      exitSession,
      backToIdle,
      handleActivity,
      resetTimer
    ]
  );

  return <ATMContext.Provider value={value}>{children}</ATMContext.Provider>;
}

export function useATM() {
  const ctx = useContext(ATMContext);
  if (!ctx) throw new Error('useATM must be used inside ATMProvider');
  return ctx;
}
