import { getMongoInstance, closeMongoConnection } from "../core/database/mongo.singleton.js";
import { CardModel } from "../modules/bank/models/Card.model.js";
import { AccountModel } from "../modules/bank/models/Account.model.js";
import { CashInventoryModel } from "../modules/cash/models/CashInventory.model.js";
import { SessionModel } from "../modules/atm/entities/Session.js";
import { TransactionModel } from "../modules/transaction/models/Transaction.model.js";
import { BANK_CODE } from "../core/constants/bank.constants.js";

async function seed() {
  await getMongoInstance();

  console.log("[seed] clearing existing data...");
  await Promise.all([
    CardModel.deleteMany({}),
    AccountModel.deleteMany({}),
    CashInventoryModel.deleteMany({}),
    SessionModel.deleteMany({}),
    TransactionModel.deleteMany({}),
  ]);

  console.log("[seed] creating accounts...");
  const accounts = await AccountModel.insertMany([
    { accountNumber: "ACC-SBI-001", holderName: "Arjun Sharma", bankCode: BANK_CODE.SBI, balance: 50000 },
    { accountNumber: "ACC-HDFC-001", holderName: "Priya Patel", bankCode: BANK_CODE.HDFC, balance: 25000 },
    { accountNumber: "ACC-ICICI-001", holderName: "Rahul Verma", bankCode: BANK_CODE.ICICI, balance: 100000 },
  ]);

  console.log("[seed] creating cards...");
  await CardModel.insertMany([
    {
      cardNumber: "4111111111111111",
      holderName: "Arjun Sharma",
      bankCode: BANK_CODE.SBI,
      pinHash: "1234",
      accountId: accounts[0]._id,
    },
    {
      cardNumber: "5222222222222222",
      holderName: "Priya Patel",
      bankCode: BANK_CODE.HDFC,
      pinHash: "5678",
      accountId: accounts[1]._id,
    },
    {
      cardNumber: "6333333333333333",
      holderName: "Rahul Verma",
      bankCode: BANK_CODE.ICICI,
      pinHash: "9999",
      accountId: accounts[2]._id,
    },
  ]);

  console.log("[seed] creating ATM cash inventory...");
  await CashInventoryModel.create({
    atmId: "ATM-1",
    notes: { 2000: 50, 500: 50, 200: 50, 100: 50 },
  });

  console.log("[seed] done. Demo cards:");
  console.log("  4111111111111111  PIN 1234  (SBI)");
  console.log("  5222222222222222  PIN 5678  (HDFC)");
  console.log("  6333333333333333  PIN 9999  (ICICI)");

  await closeMongoConnection();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("[seed] failed", err);
  await closeMongoConnection();
  process.exit(1);
});
