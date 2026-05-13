import * as atmService from "../services/atm.service.js";
import { insertCardDTO } from "../dto/insertCard.dto.js";
import { enterPinDTO } from "../dto/enterPin.dto.js";
import { withdrawDTO } from "../dto/withdraw.dto.js";
import { successResponse } from "../../../core/utils/response.util.js";
import { CardModel } from "../../bank/models/Card.model.js";
import { BANK_NAME } from "../../../core/constants/bank.constants.js";

export async function listCards(req, res, next) {
  try {
    const cards = await CardModel.find({}, "cardNumber holderName bankCode isBlocked").sort({ bankCode: 1 });
    const data = cards.map((c) => ({
      cardNumber: c.cardNumber,
      holderName: c.holderName,
      bankCode: c.bankCode,
      bankName: BANK_NAME[c.bankCode] || c.bankCode,
      isBlocked: c.isBlocked,
    }));
    successResponse(res, data);
  } catch (err) {
    next(err);
  }
}

export async function insertCard(req, res, next) {
  try {
    const dto = insertCardDTO(req.body);
    const result = await atmService.initializeSession(dto);
    successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function enterPin(req, res, next) {
  try {
    const dto = enterPinDTO(req.body);
    const result = await atmService.authenticateUser(dto);
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function selectOperation(req, res, next) {
  try {
    const result = await atmService.getSessionStatus({ sessionId: req.body.sessionId });
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function checkBalance(req, res, next) {
  try {
    const result = await atmService.processBalanceCheck({ sessionId: req.body.sessionId });
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function previewWithdraw(req, res, next) {
  try {
    const dto = withdrawDTO(req.body);
    const result = await atmService.previewWithdrawal(dto);
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function withdrawCash(req, res, next) {
  try {
    const dto = withdrawDTO(req.body);
    const result = await atmService.processWithdrawal(dto);
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function collectCash(req, res, next) {
  try {
    const result = await atmService.completeTransaction({ sessionId: req.body.sessionId });
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function ejectCard(req, res, next) {
  try {
    const result = await atmService.resetATM({ sessionId: req.body.sessionId });
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const result = await atmService.getSessionStatus({ sessionId: req.params.sessionId });
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
