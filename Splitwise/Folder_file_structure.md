> **Prompt** 
good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository ,  Repo , service , singleton if required and other required   where it needs so give me backend tree structure to simulate  above and show

```text
backend/
│
├── src/
│   │
│   ├── app.js
│   │   └── createApp()
│   │
│   ├── server.js
│   │   └── startServer()
│   │
│   ├── config/
│   │   ├── env.js
│   │   │   └── loadEnv()
│   │   │
│   │   ├── database.js
│   │   │   └── connectDatabase()               // Singleton Mongo Connection
│   │   │
│   │   └── constants.js
│   │
│   ├── modules/
│   │   │
│   │   ├── user/
│   │   │   │
│   │   │   ├── user.model.js
│   │   │   │   └── UserSchema
│   │   │   │
│   │   │   ├── user.repository.js
│   │   │   │   ├── createUser()
│   │   │   │   ├── findUserById()
│   │   │   │   ├── findUsersByIds()
│   │   │   │   └── updateUser()
│   │   │   │
│   │   │   ├── user.service.js
│   │   │   │   ├── createUser()
│   │   │   │   ├── getUserProfile()
│   │   │   │   └── validateUsersExist()
│   │   │   │
│   │   │   ├── user.controller.js
│   │   │   │   ├── registerUser()
│   │   │   │   └── getProfile()
│   │   │   │
│   │   │   ├── user.routes.js
│   │   │   │   └── registerUserRoutes()
│   │   │   │
│   │   │   └── user.validator.js
│   │   │       ├── validateCreateUser()
│   │   │       └── validateUserId()
│   │   │
│   │   ├── group/
│   │   │   │
│   │   │   ├── group.model.js
│   │   │   │   └── GroupSchema
│   │   │   │
│   │   │   ├── group.repository.js
│   │   │   │   ├── createGroup()
│   │   │   │   ├── findGroupById()
│   │   │   │   ├── updateGroup()
│   │   │   │   ├── addMember()
│   │   │   │   └── removeMember()
│   │   │   │
│   │   │   ├── group.service.js
│   │   │   │   ├── createGroup()
│   │   │   │   ├── editGroup()
│   │   │   │   ├── addMember()
│   │   │   │   ├── removeMember()
│   │   │   │   ├── leaveGroup()
│   │   │   │   └── validateGroupMembership()
│   │   │   │
│   │   │   ├── group.controller.js
│   │   │   │   ├── createGroup()
│   │   │   │   ├── editGroup()
│   │   │   │   ├── addMember()
│   │   │   │   ├── removeMember()
│   │   │   │   └── leaveGroup()
│   │   │   │
│   │   │   ├── group.routes.js
│   │   │   │   └── registerGroupRoutes()
│   │   │   │
│   │   │   └── group.validator.js
│   │   │       ├── validateCreateGroup()
│   │   │       └── validateAddMember()
│   │   │
│   │   ├── expense/
│   │   │   │
│   │   │   ├── expense.model.js
│   │   │   │   └── ExpenseSchema
│   │   │   │
│   │   │   ├── split.model.js
│   │   │   │   └── SplitSchema
│   │   │   │
│   │   │   ├── expense.repository.js
│   │   │   │   ├── createExpense()
│   │   │   │   ├── updateExpense()
│   │   │   │   ├── deleteExpense()
│   │   │   │   ├── findExpenseById()
│   │   │   │   └── findExpensesByGroup()
│   │   │   │
│   │   │   ├── expense.service.js
│   │   │   │   ├── addExpense()
│   │   │   │   ├── updateExpense()
│   │   │   │   ├── deleteExpense()
│   │   │   │   ├── validateExpenseParticipants()
│   │   │   │   └── recalculateGroupBalances()
│   │   │   │
│   │   │   ├── expense.controller.js
│   │   │   │   ├── addExpense()
│   │   │   │   ├── updateExpense()
│   │   │   │   ├── deleteExpense()
│   │   │   │   └── getGroupExpenses()
│   │   │   │
│   │   │   ├── expense.routes.js
│   │   │   │   └── registerExpenseRoutes()
│   │   │   │
│   │   │   ├── expense.validator.js
│   │   │   │   ├── validateAddExpense()
│   │   │   │   └── validateSplitPayload()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   │
│   │   │   │   ├── SplitStrategy.js
│   │   │   │   │   └── calculateShares()
│   │   │   │   │
│   │   │   │   ├── EqualSplitStrategy.js
│   │   │   │   │   └── calculateShares()
│   │   │   │   │
│   │   │   │   ├── ExactSplitStrategy.js
│   │   │   │   │   └── calculateShares()
│   │   │   │   │
│   │   │   │   └── PercentSplitStrategy.js
│   │   │   │       └── calculateShares()
│   │   │   │
│   │   │   ├── factories/
│   │   │   │   │
│   │   │   │   └── SplitStrategyFactory.js
│   │   │   │       └── createStrategy()
│   │   │   │
│   │   │   └── states/                            // Optional lightweight State Pattern
│   │   │       │
│   │   │       ├── ExpenseOpenState.js
│   │   │       │   └── canEdit()
│   │   │       │
│   │   │       └── ExpenseSettledState.js
│   │   │           └── canEdit()
│   │   │
│   │   ├── settlement/
│   │   │   │
│   │   │   ├── settlement.model.js
│   │   │   │   └── SettlementSchema
│   │   │   │
│   │   │   ├── settlement.repository.js
│   │   │   │   ├── createSettlement()
│   │   │   │   ├── updateSettlement()
│   │   │   │   ├── findSettlementsByGroup()
│   │   │   │   └── findSettlementById()
│   │   │   │
│   │   │   ├── settlement.service.js
│   │   │   │   ├── settleUp()
│   │   │   │   ├── updateSettlement()
│   │   │   │   └── validateSettlement()
│   │   │   │
│   │   │   ├── settlement.controller.js
│   │   │   │   ├── settleUp()
│   │   │   │   └── getSettlementHistory()
│   │   │   │
│   │   │   ├── settlement.routes.js
│   │   │   │   └── registerSettlementRoutes()
│   │   │   │
│   │   │   └── settlement.validator.js
│   │   │       └── validateSettlement()
│   │   │
│   │   └── balance/
│   │       │
│   │       ├── balance.service.js
│   │       │   ├── generateBalances()
│   │       │   ├── calculateNetBalances()
│   │       │   ├── simplifyDebts()
│   │       │   └── buildBalanceGraph()
│   │       │
│   │       ├── balance.controller.js
│   │       │   ├── getBalances()
│   │       │   └── getSimplifiedDebts()
│   │       │
│   │       └── balance.routes.js
│   │           └── registerBalanceRoutes()
│   │
│   ├── shared/
│   │   │
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   │   └── handleError()
│   │   │   │
│   │   │   ├── auth.middleware.js
│   │   │   │   └── authenticate()
│   │   │   │
│   │   │   └── validate.middleware.js
│   │   │       └── validateRequest()
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiResponse.js
│   │   │   ├── AppError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── amount.util.js
│   │   │   │   ├── roundAmount()
│   │   │   │   └── validateAmount()
│   │   │   │
│   │   │   └── balance.util.js
│   │   │       ├── compressDebts()
│   │   │       └── normalizeBalances()
│   │   │
│   │   └── enums/
│   │       ├── SplitType.js
│   │       ├── GroupRole.js
│   │       └── ExpenseStatus.js
│   │
│   └── routes/
│       └── index.js
│           └── registerRoutes()
│
├── tests/
│   ├── expense/
│   ├── group/
│   ├── settlement/
│   └── balance/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```



> **Prompt** 
Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 
```text id="0t9j2q"
frontend/
│
├── src/
│   │
│   ├── main.jsx
│   │   └── bootstrapApp()
│   │
│   ├── App.jsx
│   │   └── App()
│   │
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   │   └── AppRouter()
│   │   │
│   │   └── routeConfig.js
│   │       └── getRoutes()
│   │
│   ├── layouts/
│   │   │
│   │   ├── MainLayout.jsx
│   │   │   └── MainLayout()
│   │   │
│   │   ├── GroupLayout.jsx
│   │   │   └── GroupLayout()
│   │   │
│   │   └── AuthLayout.jsx
│   │       └── AuthLayout()
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   │   └── LoginPage()
│   │   │   │   │
│   │   │   │   └── RegisterPage.jsx
│   │   │   │       └── RegisterPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   └── LoginForm()
│   │   │   │   │
│   │   │   │   └── RegisterForm.jsx
│   │   │   │       └── RegisterForm()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   │       ├── login()
│   │   │   │       ├── register()
│   │   │   │       └── logout()
│   │   │   │
│   │   │   └── services/
│   │   │       └── authApi.js
│   │   │           ├── loginRequest()
│   │   │           └── registerRequest()
│   │   │
│   │   ├── dashboard/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.jsx
│   │   │   │       └── DashboardPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── GroupCard.jsx
│   │   │   │   │   └── GroupCard()
│   │   │   │   │
│   │   │   │   ├── BalanceSummaryCard.jsx
│   │   │   │   │   └── BalanceSummaryCard()
│   │   │   │   │
│   │   │   │   └── QuickActionPanel.jsx
│   │   │   │       └── QuickActionPanel()
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── useDashboard.js
│   │   │           └── fetchDashboardData()
│   │   │
│   │   ├── group/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── CreateGroupPage.jsx
│   │   │   │   │   └── CreateGroupPage()
│   │   │   │   │
│   │   │   │   ├── GroupDetailsPage.jsx
│   │   │   │   │   └── GroupDetailsPage()
│   │   │   │   │
│   │   │   │   ├── EditGroupPage.jsx
│   │   │   │   │   └── EditGroupPage()
│   │   │   │   │
│   │   │   │   └── MemberManagementPage.jsx
│   │   │   │       └── MemberManagementPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── GroupHeader.jsx
│   │   │   │   │   └── GroupHeader()
│   │   │   │   │
│   │   │   │   ├── GroupForm.jsx
│   │   │   │   │   └── GroupForm()
│   │   │   │   │
│   │   │   │   ├── MemberList.jsx
│   │   │   │   │   └── MemberList()
│   │   │   │   │
│   │   │   │   ├── MemberCard.jsx
│   │   │   │   │   └── MemberCard()
│   │   │   │   │
│   │   │   │   ├── AddMemberModal.jsx
│   │   │   │   │   └── AddMemberModal()
│   │   │   │   │
│   │   │   │   └── RemoveMemberModal.jsx
│   │   │   │       └── RemoveMemberModal()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useGroup.js
│   │   │   │       ├── createGroup()
│   │   │   │       ├── updateGroup()
│   │   │   │       ├── addMember()
│   │   │   │       ├── removeMember()
│   │   │   │       └── leaveGroup()
│   │   │   │
│   │   │   └── services/
│   │   │       └── groupApi.js
│   │   │           ├── createGroupRequest()
│   │   │           ├── updateGroupRequest()
│   │   │           ├── addMemberRequest()
│   │   │           ├── removeMemberRequest()
│   │   │           └── leaveGroupRequest()
│   │   │
│   │   ├── expense/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── AddExpensePage.jsx
│   │   │   │   │   └── AddExpensePage()
│   │   │   │   │
│   │   │   │   ├── EditExpensePage.jsx
│   │   │   │   │   └── EditExpensePage()
│   │   │   │   │
│   │   │   │   ├── ExpenseDetailsPage.jsx
│   │   │   │   │   └── ExpenseDetailsPage()
│   │   │   │   │
│   │   │   │   └── ExpenseHistoryPage.jsx
│   │   │   │       └── ExpenseHistoryPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   │   └── ExpenseForm()
│   │   │   │   │
│   │   │   │   ├── ExpenseCard.jsx
│   │   │   │   │   └── ExpenseCard()
│   │   │   │   │
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   │   └── ExpenseList()
│   │   │   │   │
│   │   │   │   ├── ParticipantSelector.jsx
│   │   │   │   │   └── ParticipantSelector()
│   │   │   │   │
│   │   │   │   ├── SplitTypeSelector.jsx
│   │   │   │   │   └── SplitTypeSelector()
│   │   │   │   │
│   │   │   │   ├── EqualSplitForm.jsx
│   │   │   │   │   └── EqualSplitForm()
│   │   │   │   │
│   │   │   │   ├── ExactSplitForm.jsx
│   │   │   │   │   └── ExactSplitForm()
│   │   │   │   │
│   │   │   │   ├── PercentSplitForm.jsx
│   │   │   │   │   └── PercentSplitForm()
│   │   │   │   │
│   │   │   │   └── ExpenseSummaryCard.jsx
│   │   │   │       └── ExpenseSummaryCard()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useExpense.js
│   │   │   │       ├── addExpense()
│   │   │   │       ├── updateExpense()
│   │   │   │       ├── deleteExpense()
│   │   │   │       └── fetchExpenses()
│   │   │   │
│   │   │   ├── strategies/                      // Frontend Strategy Pattern
│   │   │   │   │
│   │   │   │   ├── SplitStrategyFactory.js
│   │   │   │   │   └── createSplitComponent()
│   │   │   │   │
│   │   │   │   ├── EqualSplitStrategy.jsx
│   │   │   │   │   └── EqualSplitStrategy()
│   │   │   │   │
│   │   │   │   ├── ExactSplitStrategy.jsx
│   │   │   │   │   └── ExactSplitStrategy()
│   │   │   │   │
│   │   │   │   └── PercentSplitStrategy.jsx
│   │   │   │       └── PercentSplitStrategy()
│   │   │   │
│   │   │   └── services/
│   │   │       └── expenseApi.js
│   │   │           ├── addExpenseRequest()
│   │   │           ├── updateExpenseRequest()
│   │   │           ├── deleteExpenseRequest()
│   │   │           └── fetchExpensesRequest()
│   │   │
│   │   ├── settlement/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── SettleUpPage.jsx
│   │   │   │   │   └── SettleUpPage()
│   │   │   │   │
│   │   │   │   └── SettlementHistoryPage.jsx
│   │   │   │       └── SettlementHistoryPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── SettlementForm.jsx
│   │   │   │   │   └── SettlementForm()
│   │   │   │   │
│   │   │   │   ├── SettlementCard.jsx
│   │   │   │   │   └── SettlementCard()
│   │   │   │   │
│   │   │   │   └── SettlementList.jsx
│   │   │   │       └── SettlementList()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useSettlement.js
│   │   │   │       ├── settleUp()
│   │   │   │       └── fetchSettlementHistory()
│   │   │   │
│   │   │   └── services/
│   │   │       └── settlementApi.js
│   │   │           ├── settleUpRequest()
│   │   │           └── fetchSettlementHistoryRequest()
│   │   │
│   │   └── balance/
│   │       │
│   │       ├── pages/
│   │       │   ├── BalancesPage.jsx
│   │       │   │   └── BalancesPage()
│   │       │   │
│   │       │   └── SimplifiedDebtsPage.jsx
│   │       │       └── SimplifiedDebtsPage()
│   │       │
│   │       ├── components/
│   │       │   ├── BalanceCard.jsx
│   │       │   │   └── BalanceCard()
│   │       │   │
│   │       │   ├── BalanceList.jsx
│   │       │   │   └── BalanceList()
│   │       │   │
│   │       │   ├── DebtGraphCard.jsx
│   │       │   │   └── DebtGraphCard()
│   │       │   │
│   │       │   └── SimplifiedDebtList.jsx
│   │       │       └── SimplifiedDebtList()
│   │       │
│   │       ├── hooks/
│   │       │   └── useBalance.js
│   │       │       ├── fetchBalances()
│   │       │       └── fetchSimplifiedDebts()
│   │       │
│   │       └── services/
│   │           └── balanceApi.js
│   │               ├── fetchBalancesRequest()
│   │               └── fetchSimplifiedDebtsRequest()
│   │
│   ├── shared/
│   │   │
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   │   └── Button()
│   │   │   │
│   │   │   ├── Input.jsx
│   │   │   │   └── Input()
│   │   │   │
│   │   │   ├── Modal.jsx
│   │   │   │   └── Modal()
│   │   │   │
│   │   │   ├── Loader.jsx
│   │   │   │   └── Loader()
│   │   │   │
│   │   │   ├── EmptyState.jsx
│   │   │   │   └── EmptyState()
│   │   │   │
│   │   │   ├── ErrorState.jsx
│   │   │   │   └── ErrorState()
│   │   │   │
│   │   │   └── ConfirmDialog.jsx
│   │   │       └── ConfirmDialog()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useModal.js
│   │   │   │   ├── openModal()
│   │   │   │   └── closeModal()
│   │   │   │
│   │   │   └── useToast.js
│   │   │       └── showToast()
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   │   ├── get()
│   │   │   │   ├── post()
│   │   │   │   ├── patch()
│   │   │   │   └── deleteRequest()
│   │   │   │
│   │   │   └── storage.service.js
│   │   │       ├── setItem()
│   │   │       ├── getItem()
│   │   │       └── removeItem()
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   │   └── AuthProvider()
│   │   │   │
│   │   │   └── GroupContext.jsx
│   │   │       └── GroupProvider()
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.js
│   │   │   ├── splitTypes.js
│   │   │   └── apiEndpoints.js
│   │   │
│   │   └── utils/
│   │       ├── amount.util.js
│   │       │   ├── formatCurrency()
│   │       │   └── validateAmount()
│   │       │
│   │       ├── split.util.js
│   │       │   ├── calculateEqualSplit()
│   │       │   └── validateSplitSum()
│   │       │
│   │       └── balance.util.js
│   │           └── compressDebts()
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   └── assets/
│       ├── icons/
│       └── images/
│
├── public/
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```
