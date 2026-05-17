> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository ,  Repo , service , singleton if required and others too if required   where it needs so give me backend tree structure for   above and show

```text
backend/
├── src/
│
│   ├── app.js
│   │   └── functions:
│   │       - createApp()
│   │       - registerMiddlewares()
│   │       - registerRoutes()
│   │
│   ├── server.js
│   │   └── functions:
│   │       - startServer()
│   │       - connectDatabase()
│   │
│   ├── config/
│   │
│   │   ├── env.js
│   │   │   └── functions:
│   │   │       - loadEnvConfig()
│   │   │
│   │   ├── database.js
│   │   │   └── functions:
│   │   │       - connectMongoDB()
│   │   │
│   │   └── rateLimiter.config.js
│   │       └── functions:
│   │           - getDefaultRateLimitConfig()
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── auth.controller.js
│   │   │   │   └── functions:
│   │   │   │       - login()
│   │   │   │       - registerClient()
│   │   │   │
│   │   │   ├── auth.service.js
│   │   │   │   └── functions:
│   │   │   │       - validateClient()
│   │   │   │       - generateApiKey()
│   │   │   │
│   │   │   ├── auth.repository.js
│   │   │   │   └── functions:
│   │   │   │       - findClientByApiKey()
│   │   │   │       - createClient()
│   │   │   │
│   │   │   ├── auth.routes.js
│   │   │   │   └── functions:
│   │   │   │       - registerAuthRoutes()
│   │   │   │
│   │   │   └── auth.validation.js
│   │   │       └── functions:
│   │   │           - validateLoginPayload()
│   │   │
│   │   ├── rateLimiter/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   ├── rateLimiter.controller.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - allowRequest()
│   │   │   │   │       - getClientUsage()
│   │   │   │   │
│   │   │   │   └── admin.controller.js
│   │   │   │       └── functions:
│   │   │   │           - updateStrategy()
│   │   │   │           - updateLimitConfig()
│   │   │   │           - resetClientCounters()
│   │   │   │           - blockClient()
│   │   │   │           - getAllClientStats()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── rateLimiter.service.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - processRequest()
│   │   │   │   │       - buildRateLimitResponse()
│   │   │   │   │
│   │   │   │   ├── strategyManager.service.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - getActiveStrategy()
│   │   │   │   │       - switchStrategy()
│   │   │   │   │
│   │   │   │   ├── stats.service.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - incrementAllowedCount()
│   │   │   │   │       - incrementBlockedCount()
│   │   │   │   │       - getClientStatistics()
│   │   │   │   │
│   │   │   │   ├── cleanup.service.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - cleanupExpiredWindows()
│   │   │   │   │       - cleanupUnusedClients()
│   │   │   │   │
│   │   │   │   └── config.service.js
│   │   │   │       └── functions:
│   │   │   │           - getCurrentConfig()
│   │   │   │           - updateConfig()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │
│   │   │   │   ├── interfaces/
│   │   │   │   │
│   │   │   │   │   └── IRateLimiterStrategy.js
│   │   │   │   │       └── functions:
│   │   │   │   │           - allowRequest()
│   │   │   │   │
│   │   │   │   ├── FixedWindowStrategy.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - allowRequest()
│   │   │   │   │       - calculateResetTime()
│   │   │   │   │
│   │   │   │   ├── SlidingWindowStrategy.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - allowRequest()
│   │   │   │   │       - removeExpiredTimestamps()
│   │   │   │   │
│   │   │   │   └── TokenBucketStrategy.js
│   │   │   │       └── functions:
│   │   │   │           - allowRequest()
│   │   │   │           - refillTokens()
│   │   │   │
│   │   │   ├── factories/
│   │   │   │
│   │   │   │   └── strategy.factory.js
│   │   │   │       └── functions:
│   │   │   │           - createStrategy()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   ├── client.repository.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - findClientById()
│   │   │   │   │       - updateClientState()
│   │   │   │   │       - blockClient()
│   │   │   │   │
│   │   │   │   ├── rateLimit.repository.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - getClientRateLimitState()
│   │   │   │   │       - saveClientRateLimitState()
│   │   │   │   │       - resetClientState()
│   │   │   │   │
│   │   │   │   └── stats.repository.js
│   │   │   │       └── functions:
│   │   │   │           - saveRequestLog()
│   │   │   │           - fetchClientStats()
│   │   │   │
│   │   │   ├── models/
│   │   │   │
│   │   │   │   ├── Client.model.js
│   │   │   │   │   └── fields:
│   │   │   │   │       - clientId
│   │   │   │   │       - apiKey
│   │   │   │   │       - status
│   │   │   │   │
│   │   │   │   ├── RateLimitState.model.js
│   │   │   │   │   └── fields:
│   │   │   │   │       - clientId
│   │   │   │   │       - strategyType
│   │   │   │   │       - requestCount
│   │   │   │   │       - timestamps
│   │   │   │   │       - tokens
│   │   │   │   │
│   │   │   │   └── RequestLog.model.js
│   │   │   │       └── fields:
│   │   │   │           - clientId
│   │   │   │           - allowed
│   │   │   │           - strategy
│   │   │   │           - createdAt
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │
│   │   │   │   ├── apiKey.middleware.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - validateApiKey()
│   │   │   │   │
│   │   │   │   ├── rateLimit.middleware.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - handleRateLimit()
│   │   │   │   │
│   │   │   │   └── admin.middleware.js
│   │   │   │       └── functions:
│   │   │   │           - validateAdminAccess()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │
│   │   │   │   ├── rateLimiter.routes.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - registerRateLimiterRoutes()
│   │   │   │   │
│   │   │   │   └── admin.routes.js
│   │   │   │       └── functions:
│   │   │   │           - registerAdminRoutes()
│   │   │   │
│   │   │   ├── dto/
│   │   │   │
│   │   │   │   ├── RequestContext.dto.js
│   │   │   │   └── RateLimitResponse.dto.js
│   │   │   │
│   │   │   ├── state/
│   │   │   │
│   │   │   │   ├── ClientState.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - incrementRequests()
│   │   │   │   │       - resetWindow()
│   │   │   │   │       - consumeToken()
│   │   │   │   │
│   │   │   │   └── RateLimiterStateManager.js
│   │   │   │       └── functions:
│   │   │   │           - getClientState()
│   │   │   │           - updateClientState()
│   │   │   │
│   │   │   ├── singleton/
│   │   │   │
│   │   │   │   └── strategyRegistry.singleton.js
│   │   │   │       └── functions:
│   │   │   │           - getInstance()
│   │   │   │           - registerStrategy()
│   │   │   │           - getStrategy()
│   │   │   │
│   │   │   ├── utils/
│   │   │   │
│   │   │   │   ├── time.util.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - getCurrentTimestamp()
│   │   │   │   │       - isExpired()
│   │   │   │   │
│   │   │   │   ├── response.util.js
│   │   │   │   │   └── functions:
│   │   │   │   │       - successResponse()
│   │   │   │   │       - errorResponse()
│   │   │   │   │
│   │   │   │   └── logger.util.js
│   │   │   │       └── functions:
│   │   │   │           - info()
│   │   │   │           - error()
│   │   │   │
│   │   │   └── constants/
│   │   │
│   │   │       ├── strategyTypes.js
│   │   │       ├── httpStatus.js
│   │   │       └── messages.js
│   │
│   └── shared/
│       │
│       ├── exceptions/
│       │
│       │   ├── AppError.js
│       │   ├── RateLimitExceededError.js
│       │   └── UnauthorizedError.js
│       │
│       └── middleware/
│           │
│           ├── errorHandler.middleware.js
│           └── requestLogger.middleware.js
│
├── package.json
├── .env
├── .gitignore
└── README.md
```



> **Prompt** Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 


```text
frontend/
├── src/
│
│   ├── main.jsx
│   │   └── functions:
│   │       - bootstrapApplication()
│   │
│   ├── App.jsx
│   │   └── functions:
│   │       - registerRoutes()
│   │       - initializeProviders()
│   │
│   ├── app/
│   │
│   │   ├── router/
│   │   │
│   │   │   └── AppRouter.jsx
│   │   │       └── functions:
│   │   │           - renderRoutes()
│   │   │
│   │   ├── providers/
│   │   │
│   │   │   ├── ThemeProvider.jsx
│   │   │   │   └── functions:
│   │   │   │       - provideTheme()
│   │   │   │
│   │   │   ├── AuthProvider.jsx
│   │   │   │   └── functions:
│   │   │   │       - provideAuth()
│   │   │   │
│   │   │   └── QueryProvider.jsx
│   │   │       └── functions:
│   │   │           - provideQueryClient()
│   │   │
│   │   └── layouts/
│   │       │
│   │       ├── AdminLayout.jsx
│   │       │   └── functions:
│   │       │       - renderSidebar()
│   │       │       - renderHeader()
│   │       │       - renderContent()
│   │       │
│   │       └── ClientLayout.jsx
│   │           └── functions:
│   │               - renderSidebar()
│   │               - renderHeader()
│   │               - renderContent()
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   └── LoginPage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderLoginForm()
│   │   │   │           - handleLogin()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   └── LoginForm.jsx
│   │   │   │       └── functions:
│   │   │   │           - handleSubmit()
│   │   │   │           - validateInputs()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── auth.service.js
│   │   │   │       └── functions:
│   │   │   │           - login()
│   │   │   │           - logout()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │   └── useAuth.js
│   │   │   │       └── functions:
│   │   │   │           - useLogin()
│   │   │   │           - useLogout()
│   │   │   │
│   │   │   └── store/
│   │   │       │
│   │   │       └── auth.store.js
│   │   │           └── functions:
│   │   │               - setUser()
│   │   │               - clearUser()
│   │   │
│   │   ├── dashboard/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderOverviewCards()
│   │   │   │   │       - renderTrafficChart()
│   │   │   │   │       - renderTopClients()
│   │   │   │   │
│   │   │   │   └── ClientDashboardPage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderUsageCard()
│   │   │   │           - renderQuotaInfo()
│   │   │   │           - renderStrategyInfo()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderStats()
│   │   │   │   │
│   │   │   │   ├── TrafficChart.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderChart()
│   │   │   │   │
│   │   │   │   ├── UsageProgress.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderProgress()
│   │   │   │   │
│   │   │   │   └── StrategyBadge.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderStrategy()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── dashboard.service.js
│   │   │   │       └── functions:
│   │   │   │           - fetchAdminDashboard()
│   │   │   │           - fetchClientDashboard()
│   │   │   │
│   │   │   └── hooks/
│   │   │       │
│   │   │       └── useDashboard.js
│   │   │           └── functions:
│   │   │               - useDashboardData()
│   │   │
│   │   ├── strategies/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   └── StrategyManagementPage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderStrategies()
│   │   │   │           - handleStrategySelection()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── StrategyCard.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderCard()
│   │   │   │   │       - renderSelectedState()
│   │   │   │   │
│   │   │   │   ├── FixedWindowPreview.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderWindowFlow()
│   │   │   │   │
│   │   │   │   ├── SlidingWindowPreview.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderSlidingFlow()
│   │   │   │   │
│   │   │   │   └── TokenBucketPreview.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderTokenFlow()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── strategy.service.js
│   │   │   │       └── functions:
│   │   │   │           - fetchStrategies()
│   │   │   │           - updateStrategy()
│   │   │   │
│   │   │   └── hooks/
│   │   │       │
│   │   │       └── useStrategy.js
│   │   │           └── functions:
│   │   │               - useStrategies()
│   │   │               - useUpdateStrategy()
│   │   │
│   │   ├── configurations/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   └── ConfigurationPage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderConfigForm()
│   │   │   │           - handleSaveConfig()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── ConfigForm.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - handleInputChange()
│   │   │   │   │       - handleSubmit()
│   │   │   │   │
│   │   │   │   └── ConfigPreview.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderPreview()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── configuration.service.js
│   │   │   │       └── functions:
│   │   │   │           - fetchConfig()
│   │   │   │           - saveConfig()
│   │   │   │
│   │   │   └── hooks/
│   │   │       │
│   │   │       └── useConfiguration.js
│   │   │           └── functions:
│   │   │               - useConfig()
│   │   │               - useSaveConfig()
│   │   │
│   │   ├── users/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   ├── UserManagementPage.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderUsersTable()
│   │   │   │   │       - handleBlockUser()
│   │   │   │   │       - handleResetCounters()
│   │   │   │   │
│   │   │   │   └── ClientDetailsPage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderClientOverview()
│   │   │   │           - renderUsageHistory()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── UserTable.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderRows()
│   │   │   │   │
│   │   │   │   ├── UserStatusBadge.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderStatus()
│   │   │   │   │
│   │   │   │   ├── UserActions.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - handleReset()
│   │   │   │   │       - handleBlock()
│   │   │   │   │
│   │   │   │   └── UsageHistoryChart.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderUsageHistory()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── users.service.js
│   │   │   │       └── functions:
│   │   │   │           - fetchUsers()
│   │   │   │           - blockUser()
│   │   │   │           - resetUserCounters()
│   │   │   │           - fetchClientDetails()
│   │   │   │
│   │   │   └── hooks/
│   │   │       │
│   │   │       └── useUsers.js
│   │   │           └── functions:
│   │   │               - useUsers()
│   │   │               - useBlockUser()
│   │   │               - useResetCounters()
│   │   │
│   │   ├── apiConsole/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   └── ApiConsolePage.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderRequestForm()
│   │   │   │           - handleSendRequest()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── RequestForm.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - handleEndpointChange()
│   │   │   │   │       - handleSubmit()
│   │   │   │   │
│   │   │   │   ├── ResponseCard.jsx
│   │   │   │   │   └── functions:
│   │   │   │   │       - renderResponse()
│   │   │   │   │
│   │   │   │   └── QuotaInfoCard.jsx
│   │   │   │       └── functions:
│   │   │   │           - renderQuota()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── apiConsole.service.js
│   │   │   │       └── functions:
│   │   │   │           - sendRequest()
│   │   │   │
│   │   │   └── hooks/
│   │   │       │
│   │   │       └── useApiConsole.js
│   │   │           └── functions:
│   │   │               - useSendRequest()
│   │   │
│   │   └── shared/
│   │       │
│   │       ├── components/
│   │       │
│   │       │   ├── Sidebar.jsx
│   │       │   │   └── functions:
│   │       │   │       - renderMenuItems()
│   │       │   │
│   │       │   ├── Header.jsx
│   │       │   │   └── functions:
│   │       │   │       - renderProfileMenu()
│   │       │   │
│   │       │   ├── Button.jsx
│   │       │   │   └── functions:
│   │       │   │       - renderButton()
│   │       │   │
│   │       │   ├── Loader.jsx
│   │       │   │   └── functions:
│   │       │   │       - renderLoader()
│   │       │   │
│   │       │   ├── EmptyState.jsx
│   │       │   │   └── functions:
│   │       │   │       - renderEmptyState()
│   │       │   │
│   │       │   └── Modal.jsx
│   │       │       └── functions:
│   │       │           - renderModal()
│   │       │
│   │       ├── hooks/
│   │       │
│   │       │   ├── useDebounce.js
│   │       │   └── useModal.js
│   │       │
│   │       ├── services/
│   │       │
│   │       │   └── httpClient.js
│   │       │       └── functions:
│   │       │           - get()
│   │       │           - post()
│   │       │           - put()
│   │       │           - delete()
│   │       │
│   │       ├── store/
│   │       │
│   │       │   └── app.store.js
│   │       │       └── functions:
│   │       │           - setLoading()
│   │       │           - setTheme()
│   │       │
│   │       ├── utils/
│   │       │
│   │       │   ├── format.util.js
│   │       │   │   └── functions:
│   │       │   │       - formatDate()
│   │       │   │       - formatPercentage()
│   │       │   │
│   │       │   ├── chart.util.js
│   │       │   │   └── functions:
│   │       │   │       - buildChartData()
│   │       │   │
│   │       │   └── response.util.js
│   │       │       └── functions:
│   │       │           - parseApiResponse()
│   │       │
│   │       └── constants/
│   │
│   │           ├── routes.js
│   │           ├── strategyTypes.js
│   │           └── sidebarMenus.js
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```

