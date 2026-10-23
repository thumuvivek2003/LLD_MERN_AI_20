export const pricingApi = {
  list: async () => [
    { id: 'weekday', name: 'Weekday Pricing', baseRate: 30, unit: 'hour', active: true },
    { id: 'weekend', name: 'Weekend Pricing', baseRate: 50, unit: 'hour', active: true },
    { id: 'flat', name: 'Flat Pricing', baseRate: 200, unit: 'day', active: false },
  ],
};
