> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository ,  Repo , service , singleton where it needs so give me backend tree structure

```txt
backend/
│
├── src/
│
│   ├── app.js
│   │     └── createApp()
│   │
│   ├── server.js
│   │     └── startServer()
│   │
│   ├── config/
│   │
│   │   ├── env.config.js
│   │   │     └── loadEnvConfig()
│   │   │
│   │   ├── db.config.js
│   │   │     └── connectDatabase()
│   │   │
│   │   └── atm.config.js
│   │         ├── getATMTimeout()
│   │         ├── getSupportedDenominations()
│   │         └── getMaxPinAttempts()
│   │
│   ├── core/
│   │
│   │   ├── constants/
│   │   │
│   │   │   ├── atmState.constants.js
│   │   │   ├── transaction.constants.js
│   │   │   ├── bank.constants.js
│   │   │   └── denomination.constants.js
│   │   │
│   │   ├── errors/
│   │   │
│   │   │   ├── AppError.js
│   │   │   │     └── constructor()
│   │   │   │
│   │   │   ├── AuthenticationError.js
│   │   │   ├── ATMStateError.js
│   │   │   ├── InsufficientBalanceError.js
│   │   │   ├── InsufficientATMCashError.js
│   │   │   └── CardBlockedError.js
│   │   │
│   │   ├── middlewares/
│   │   │
│   │   │   ├── error.middleware.js
│   │   │   │     └── globalErrorHandler()
│   │   │   │
│   │   │   ├── requestLogger.middleware.js
│   │   │   │     └── requestLogger()
│   │   │   │
│   │   │   └── validate.middleware.js
│   │   │         └── validateRequest()
│   │   │
│   │   ├── utils/
│   │   │
│   │   │   ├── response.util.js
│   │   │   │     ├── successResponse()
│   │   │   │     └── errorResponse()
│   │   │   │
│   │   │   ├── amount.util.js
│   │   │   │     └── validateDenominationAmount()
│   │   │   │
│   │   │   ├── session.util.js
│   │   │   │     └── isSessionExpired()
│   │   │   │
│   │   │   └── transaction.util.js
│   │   │         └── generateTransactionId()
│   │   │
│   │   └── database/
│   │         └── mongo.singleton.js
│   │               ├── getMongoInstance()
│   │               └── closeMongoConnection()
│   │
│   ├── modules/
│   │
│   │   ├── atm/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── atm.controller.js
│   │   │   │         ├── insertCard()
│   │   │   │         ├── enterPin()
│   │   │   │         ├── selectOperation()
│   │   │   │         ├── checkBalance()
│   │   │   │         ├── withdrawCash()
│   │   │   │         ├── collectCash()
│   │   │   │         └── ejectCard()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │
│   │   │   │   └── atm.routes.js
│   │   │   │         └── registerATMRoutes()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── atm.service.js
│   │   │   │   │     ├── initializeSession()
│   │   │   │   │     ├── authenticateUser()
│   │   │   │   │     ├── processWithdrawal()
│   │   │   │   │     ├── processBalanceCheck()
│   │   │   │   │     ├── completeTransaction()
│   │   │   │   │     └── resetATM()
│   │   │   │   │
│   │   │   │   ├── session.service.js
│   │   │   │   │     ├── createSession()
│   │   │   │   │     ├── updateLastActivity()
│   │   │   │   │     ├── validateSession()
│   │   │   │   │     └── destroySession()
│   │   │   │   │
│   │   │   │   └── transaction.service.js
│   │   │   │         ├── startTransaction()
│   │   │   │         ├── completeTransaction()
│   │   │   │         └── failTransaction()
│   │   │   │
│   │   │   ├── states/                     // STATE PATTERN
│   │   │   │
│   │   │   │   ├── ATMState.js
│   │   │   │   │     ├── insertCard()
│   │   │   │   │     ├── enterPin()
│   │   │   │   │     ├── withdrawCash()
│   │   │   │   │     ├── checkBalance()
│   │   │   │   │     └── ejectCard()
│   │   │   │   │
│   │   │   │   ├── IdleState.js
│   │   │   │   │     └── insertCard()
│   │   │   │   │
│   │   │   │   ├── CardInsertedState.js
│   │   │   │   │     └── enterPin()
│   │   │   │   │
│   │   │   │   ├── AuthenticatedState.js
│   │   │   │   │     ├── withdrawCash()
│   │   │   │   │     ├── checkBalance()
│   │   │   │   │     └── ejectCard()
│   │   │   │   │
│   │   │   │   ├── DispensingCashState.js
│   │   │   │   │     └── collectCash()
│   │   │   │   │
│   │   │   │   └── OutOfServiceState.js
│   │   │   │
│   │   │   ├── entities/
│   │   │   │
│   │   │   │   ├── ATM.js
│   │   │   │   │     ├── setState()
│   │   │   │   │     ├── getState()
│   │   │   │   │     └── handleOperation()
│   │   │   │   │
│   │   │   │   └── Session.js
│   │   │   │         ├── updateActivity()
│   │   │   │         └── isExpired()
│   │   │   │
│   │   │   └── dto/
│   │   │         ├── insertCard.dto.js
│   │   │         ├── enterPin.dto.js
│   │   │         └── withdraw.dto.js
│   │   │
│   │   ├── bank/
│   │   │
│   │   │   ├── factory/                   // FACTORY PATTERN
│   │   │   │
│   │   │   │   └── bankService.factory.js
│   │   │   │         └── createBankService()
│   │   │   │
│   │   │   ├── strategies/                // STRATEGY PATTERN
│   │   │   │
│   │   │   │   ├── BankService.js
│   │   │   │   │     ├── authenticate()
│   │   │   │   │     ├── checkBalance()
│   │   │   │   │     └── withdraw()
│   │   │   │   │
│   │   │   │   ├── SBIBankService.js
│   │   │   │   │     ├── authenticate()
│   │   │   │   │     ├── checkBalance()
│   │   │   │   │     └── withdraw()
│   │   │   │   │
│   │   │   │   ├── HDFCBankService.js
│   │   │   │   └── ICICIBankService.js
│   │   │   │
│   │   │   ├── repositories/              // REPOSITORY PATTERN
│   │   │   │
│   │   │   │   ├── account.repository.js
│   │   │   │   │     ├── findByCardNumber()
│   │   │   │   │     ├── updateBalance()
│   │   │   │   │     └── incrementPinAttempts()
│   │   │   │   │
│   │   │   │   └── card.repository.js
│   │   │   │         ├── findCard()
│   │   │   │         └── blockCard()
│   │   │   │
│   │   │   ├── models/
│   │   │   │
│   │   │   │   ├── Account.model.js
│   │   │   │   └── Card.model.js
│   │   │   │
│   │   │   └── schemas/
│   │   │         ├── account.schema.js
│   │   │         └── card.schema.js
│   │   │
│   │   ├── cash/
│   │   │
│   │   │   ├── strategies/
│   │   │   │
│   │   │   │   ├── CashDispenseStrategy.js
│   │   │   │   │     └── dispense()
│   │   │   │   │
│   │   │   │   └── GreedyDispenseStrategy.js
│   │   │   │         └── dispense()
│   │   │   │
│   │   │   ├── chain/                     // CHAIN OF RESPONSIBILITY
│   │   │   │
│   │   │   │   ├── DispenseHandler.js
│   │   │   │   │     ├── setNext()
│   │   │   │   │     └── handle()
│   │   │   │   │
│   │   │   │   ├── Note2000Handler.js
│   │   │   │   ├── Note500Handler.js
│   │   │   │   ├── Note200Handler.js
│   │   │   │   └── Note100Handler.js
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── cashDispenser.service.js
│   │   │   │   │     ├── prepareCash()
│   │   │   │   │     ├── collectCash()
│   │   │   │   │     └── rollbackCash()
│   │   │   │   │
│   │   │   │   └── cashInventory.service.js
│   │   │   │         ├── validateCashAvailability()
│   │   │   │         ├── deductCash()
│   │   │   │         └── addCash()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── cash.repository.js
│   │   │   │         ├── getInventory()
│   │   │   │         └── updateInventory()
│   │   │   │
│   │   │   └── models/
│   │   │         └── CashInventory.model.js
│   │   │
│   │   ├── hardware/
│   │   │
│   │   │   ├── interfaces/
│   │   │   │
│   │   │   │   ├── CardReader.js
│   │   │   │   │     └── readCard()
│   │   │   │   │
│   │   │   │   ├── Keypad.js
│   │   │   │   │     └── captureInput()
│   │   │   │   │
│   │   │   │   ├── Screen.js
│   │   │   │   │     └── display()
│   │   │   │   │
│   │   │   │   └── CashDispenser.js
│   │   │   │         └── dispense()
│   │   │   │
│   │   │   ├── implementations/
│   │   │   │
│   │   │   │   ├── WebCardReader.js
│   │   │   │   │     └── readCard()
│   │   │   │   │
│   │   │   │   ├── WebKeypad.js
│   │   │   │   │     └── captureInput()
│   │   │   │   │
│   │   │   │   ├── WebScreen.js
│   │   │   │   │     └── display()
│   │   │   │   │
│   │   │   │   └── WebCashDispenser.js
│   │   │   │         └── dispense()
│   │   │   │
│   │   │   └── factory/
│   │   │         └── hardware.factory.js
│   │   │               ├── createCardReader()
│   │   │               ├── createKeypad()
│   │   │               ├── createScreen()
│   │   │               └── createCashDispenser()
│   │   │
│   │   └── transaction/
│   │
│   │       ├── repositories/
│   │       │
│   │       │   └── transaction.repository.js
│   │       │         ├── createTransaction()
│   │       │         ├── updateTransactionStatus()
│   │       │         └── getTransactions()
│   │       │
│   │       ├── models/
│   │       │
│   │       │   └── Transaction.model.js
│   │       │
│   │       └── schemas/
│   │             └── transaction.schema.js
│   │
│   └── routes/
│       │
│       └── index.js
│             └── registerRoutes()
│
├── package.json
├── .env
├── .gitignore
└── README.md
```
