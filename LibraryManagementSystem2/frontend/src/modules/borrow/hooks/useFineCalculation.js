import { calcOverdueDays } from '../utils/dueDateUtils.js';
import { defaultFineStrategy } from '../strategies/defaultFineStrategy.js';
import { premiumFineStrategy } from '../strategies/premiumFineStrategy.js';

export function useFineCalculation(isPremium = false) {
  const strategy = isPremium ? premiumFineStrategy : defaultFineStrategy;
  const calculate = (dueDate) => strategy.calculate(calcOverdueDays(dueDate));
  return { calculate };
}
