export const validateOtpPayload = (body = {}) => {
  const errors = [];
  if (!body.otp || String(body.otp).length < 3) errors.push('otp required');
  return errors;
};
