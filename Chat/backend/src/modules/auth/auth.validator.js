import { body } from 'express-validator';

export const validateMobile = [
  body('mobile')
    .isString()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('mobile must be a 10-digit number'),
];

export const validateOtp = [
  body('mobile')
    .isString()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('mobile must be a 10-digit number'),
  body('otp')
    .isString()
    .trim()
    .isLength({ min: 4, max: 8 })
    .withMessage('otp is required'),
  body('name').optional().isString().trim(),
];
