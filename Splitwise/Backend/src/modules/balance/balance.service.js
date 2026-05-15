import { AppError } from "../../core/errors/AppError.js";
import { roundAmount } from "../../core/utils/amount.util.js";
import * as groupRepo from "../group/group.repository.js";
import * as expenseRepo from "../expense/expense.repository.js";
import * as settlementRepo from "../settlement/settlement.repository.js";

const TOLERANCE = 0.01;

async function loadGroupOrThrow(groupId) {
  const group = await groupRepo.findGroupById(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404, "Group not found");
  return group;
}

function buildNameIndex(group) {
  const idx = new Map();
  for (const m of group.members) idx.set(m.userId, m.name);
  return idx;
}

function relevantUserIds(group, expenses, settlements) {
  const ids = new Set();
  for (const m of group.members) ids.add(m.userId);
  for (const e of expenses) {
    ids.add(e.paidBy);
    for (const s of e.shares || []) ids.add(s.userId);
    for (const p of e.participants || []) ids.add(p);
  }
  for (const s of settlements) {
    ids.add(s.fromUserId);
    ids.add(s.toUserId);
  }
  return ids;
}

export async function calculateNetBalances(groupId) {
  const group = await loadGroupOrThrow(groupId);
  const expenses = await expenseRepo.findExpensesByGroup(groupId);
  const settlements = await settlementRepo.findSettlementsByGroup(groupId);
  const names = buildNameIndex(group);

  const net = new Map();
  for (const id of relevantUserIds(group, expenses, settlements)) {
    net.set(id, 0);
  }

  for (const e of expenses) {
    net.set(e.paidBy, (net.get(e.paidBy) || 0) + e.amount);
    for (const s of e.shares || []) {
      net.set(s.userId, (net.get(s.userId) || 0) - s.amount);
    }
  }

  for (const s of settlements) {
    net.set(s.fromUserId, (net.get(s.fromUserId) || 0) + s.amount);
    net.set(s.toUserId, (net.get(s.toUserId) || 0) - s.amount);
  }

  const balances = [];
  for (const [userId, amount] of net) {
    balances.push({
      userId,
      name: names.get(userId) || userId,
      netAmount: roundAmount(amount),
    });
  }
  balances.sort((a, b) => b.netAmount - a.netAmount);
  return balances;
}

export async function simplifyDebts(groupId) {
  const balances = await calculateNetBalances(groupId);
  const nameOf = new Map(balances.map((b) => [b.userId, b.name]));

  const creditors = balances
    .filter((b) => b.netAmount > TOLERANCE)
    .map((b) => ({ userId: b.userId, amount: b.netAmount }))
    .sort((a, b) => b.amount - a.amount);
  const debtors = balances
    .filter((b) => b.netAmount < -TOLERANCE)
    .map((b) => ({ userId: b.userId, amount: -b.netAmount }))
    .sort((a, b) => b.amount - a.amount);

  const debts = [];
  let i = 0;
  let j = 0;
  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i];
    const d = debtors[j];
    const pay = Math.min(c.amount, d.amount);
    const rounded = roundAmount(pay);
    if (rounded > 0) {
      debts.push({
        fromUserId: d.userId,
        fromName: nameOf.get(d.userId) || d.userId,
        toUserId: c.userId,
        toName: nameOf.get(c.userId) || c.userId,
        amount: rounded,
      });
    }
    c.amount = roundAmount(c.amount - pay);
    d.amount = roundAmount(d.amount - pay);
    if (c.amount <= TOLERANCE) i += 1;
    if (d.amount <= TOLERANCE) j += 1;
  }
  return debts;
}

export async function generateBalances(groupId) {
  return calculateNetBalances(groupId);
}

export async function getSimplifiedDebts(groupId) {
  return simplifyDebts(groupId);
}
