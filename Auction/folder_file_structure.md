> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Pub Sub, Strategy , State , Factory , Repository ,  Repo , service , singleton if required and other required   where it needs so give me backend tree structure to simulate  above and show
```text
backend/
│
├── src/
│
│   ├── app.js
│   │     bootstrapApp()
│   │
│   ├── server.js
│   │     startServer()
│   │
│   ├── config/
│   │
│   │   ├── db.config.js
│   │   │     connectDB()
│   │   │
│   │   ├── socket.config.js
│   │   │     initializeSocket()
│   │   │
│   │   └── env.config.js
│   │         loadEnv()
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── controllers/
│   │   │   │     auth.controller.js
│   │   │   │       login()
│   │   │   │       register()
│   │   │   │
│   │   │   ├── services/
│   │   │   │     auth.service.js
│   │   │   │       authenticateUser()
│   │   │   │       createUser()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │     auth.repository.js
│   │   │   │       findByEmail()
│   │   │   │       create()
│   │   │   │
│   │   │   ├── models/
│   │   │   │     user.model.js
│   │   │   │
│   │   │   ├── routes/
│   │   │   │     auth.routes.js
│   │   │   │
│   │   │   └── dtos/
│   │   │         auth.dto.js
│   │   │
│   │   ├── auction/
│   │   │
│   │   │   ├── controllers/
│   │   │   │     auction.controller.js
│   │   │   │       createAuction()
│   │   │   │       getAuctionById()
│   │   │   │       getLiveAuctions()
│   │   │   │       closeAuction()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │     auction.service.js
│   │   │   │       createAuction()
│   │   │   │       startAuction()
│   │   │   │       closeAuction()
│   │   │   │       getAuctionDetails()
│   │   │   │
│   │   │   │     bid.service.js
│   │   │   │       placeBid()
│   │   │   │       processHighestBid()
│   │   │   │       validateAndLockAuction()
│   │   │   │
│   │   │   │     auctionScheduler.service.js
│   │   │   │       autoStartAuction()
│   │   │   │       autoCloseAuction()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │     auction.repository.js
│   │   │   │       create()
│   │   │   │       update()
│   │   │   │       findById()
│   │   │   │       getLiveAuctions()
│   │   │   │
│   │   │   │     bid.repository.js
│   │   │   │       createBid()
│   │   │   │       getAuctionBids()
│   │   │   │
│   │   │   ├── models/
│   │   │   │
│   │   │   │     auction.model.js
│   │   │   │
│   │   │   │     bid.model.js
│   │   │   │
│   │   │   │     auctionItem.model.js
│   │   │   │
│   │   │   ├── routes/
│   │   │   │
│   │   │   │     auction.routes.js
│   │   │   │
│   │   │   │     bid.routes.js
│   │   │   │
│   │   │   ├── sockets/
│   │   │   │
│   │   │   │     auction.socket.js
│   │   │   │       joinAuctionRoom()
│   │   │   │       leaveAuctionRoom()
│   │   │   │
│   │   │   ├── validators/
│   │   │   │
│   │   │   │     bidValidators/
│   │   │   │
│   │   │   │       baseBid.validator.js
│   │   │   │         setNext()
│   │   │   │         validate()
│   │   │   │
│   │   │   │       auctionOpen.validator.js
│   │   │   │         validate()
│   │   │   │
│   │   │   │       eligibleBidder.validator.js
│   │   │   │         validate()
│   │   │   │
│   │   │   │       walletBalance.validator.js
│   │   │   │         validate()
│   │   │   │
│   │   │   │       minimumBid.validator.js
│   │   │   │         validate()
│   │   │   │
│   │   │   │       bidTime.validator.js
│   │   │   │         validate()
│   │   │   │
│   │   │   │     bidValidationChain.builder.js
│   │   │   │       buildValidationChain()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │
│   │   │   │     incrementStrategies/
│   │   │   │
│   │   │   │       fixedIncrement.strategy.js
│   │   │   │         validateIncrement()
│   │   │   │
│   │   │   │       percentageIncrement.strategy.js
│   │   │   │         validateIncrement()
│   │   │   │
│   │   │   │     strategyFactory.js
│   │   │   │       createIncrementStrategy()
│   │   │   │
│   │   │   ├── states/
│   │   │   │
│   │   │   │     baseAuction.state.js
│   │   │   │       placeBid()
│   │   │   │       closeAuction()
│   │   │   │
│   │   │   │     scheduledAuction.state.js
│   │   │   │       placeBid()
│   │   │   │       startAuction()
│   │   │   │
│   │   │   │     openAuction.state.js
│   │   │   │       placeBid()
│   │   │   │       closeAuction()
│   │   │   │
│   │   │   │     closedAuction.state.js
│   │   │   │       placeBid()
│   │   │   │
│   │   │   │     auctionState.factory.js
│   │   │   │       createAuctionState()
│   │   │   │
│   │   │   ├── events/
│   │   │   │
│   │   │   │     auction.events.js
│   │   │   │       AUCTION_STARTED
│   │   │   │       AUCTION_CLOSED
│   │   │   │       NEW_HIGHEST_BID
│   │   │   │
│   │   │   │     bidPlaced.event.js
│   │   │   │
│   │   │   │     auctionClosed.event.js
│   │   │   │
│   │   │   ├── subscribers/
│   │   │   │
│   │   │   │     liveBid.subscriber.js
│   │   │   │       notifyLiveUsers()
│   │   │   │
│   │   │   │     auctionClose.subscriber.js
│   │   │   │       notifyAuctionClosed()
│   │   │   │
│   │   │   │     auditLog.subscriber.js
│   │   │   │       storeAuditLog()
│   │   │   │
│   │   │   └── dtos/
│   │   │
│   │   │         auction.dto.js
│   │   │         bid.dto.js
│   │   │
│   │   ├── wallet/
│   │   │
│   │   │   ├── controllers/
│   │   │   │     wallet.controller.js
│   │   │   │       topUpWallet()
│   │   │   │       getWalletBalance()
│   │   │   │
│   │   │   ├── services/
│   │   │   │     wallet.service.js
│   │   │   │       creditBalance()
│   │   │   │       debitBalance()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │     wallet.repository.js
│   │   │   │       updateBalance()
│   │   │   │       findWallet()
│   │   │   │
│   │   │   ├── models/
│   │   │   │     wallet.model.js
│   │   │   │
│   │   │   └── routes/
│   │   │         wallet.routes.js
│   │   │
│   │   └── user/
│   │
│   │       ├── controllers/
│   │       │     user.controller.js
│   │       │       getUsers()
│   │       │       assignEligibleUsers()
│   │       │
│   │       ├── services/
│   │       │     user.service.js
│   │       │       getEligibleUsers()
│   │       │
│   │       ├── repositories/
│   │       │     user.repository.js
│   │       │       findById()
│   │       │       getUsers()
│   │       │
│   │       ├── routes/
│   │       │     user.routes.js
│   │       │
│   │       └── dtos/
│   │             user.dto.js
│   │
│   ├── shared/
│   │
│   │   ├── middleware/
│   │   │
│   │   │     auth.middleware.js
│   │   │       authenticate()
│   │   │
│   │   │     role.middleware.js
│   │   │       authorizeRoles()
│   │   │
│   │   │     error.middleware.js
│   │   │       globalErrorHandler()
│   │   │
│   │   ├── eventBus/
│   │   │
│   │   │     eventBus.singleton.js
│   │   │       publish()
│   │   │       subscribe()
│   │   │
│   │   ├── locks/
│   │   │
│   │   │     auctionLockManager.singleton.js
│   │   │       lock()
│   │   │       unlock()
│   │   │
│   │   ├── socket/
│   │   │
│   │   │     socketManager.singleton.js
│   │   │       emitToRoom()
│   │   │       joinRoom()
│   │   │
│   │   ├── constants/
│   │   │
│   │   │     roles.constant.js
│   │   │
│   │   │     auctionStatus.constant.js
│   │   │
│   │   ├── utils/
│   │   │
│   │   │     response.util.js
│   │   │       successResponse()
│   │   │       errorResponse()
│   │   │
│   │   │     time.util.js
│   │   │       isAuctionExpired()
│   │   │
│   │   │     logger.util.js
│   │   │       logInfo()
│   │   │       logError()
│   │   │
│   │   └── errors/
│   │
│   │         app.error.js
│   │         validation.error.js
│   │         authorization.error.js
│   │
│   └── jobs/
│
│       └── auction.job.js
│             startAuctionScheduler()
│             closeAuctionScheduler()
│
├── package.json
│
└── README.md
```

> **Prompt** Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 

```text id="vs39nq"
frontend/
│
├── src/
│
│   ├── main.jsx
│   │     bootstrapReactApp()
│   │
│   ├── App.jsx
│   │     App()
│   │
│   ├── routes/
│   │
│   │   ├── AppRouter.jsx
│   │   │     AppRouter()
│   │   │
│   │   ├── ProtectedRoute.jsx
│   │   │     ProtectedRoute()
│   │   │
│   │   └── RoleBasedRoute.jsx
│   │         RoleBasedRoute()
│   │
│   ├── layouts/
│   │
│   │   ├── AdminLayout.jsx
│   │   │     AdminLayout()
│   │   │
│   │   ├── MemberLayout.jsx
│   │   │     MemberLayout()
│   │   │
│   │   └── SpectatorLayout.jsx
│   │         SpectatorLayout()
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │     LoginPage.jsx
│   │   │   │       LoginPage()
│   │   │   │
│   │   │   │     RegisterPage.jsx
│   │   │   │       RegisterPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │     LoginForm.jsx
│   │   │   │       LoginForm()
│   │   │   │
│   │   │   │     RegisterForm.jsx
│   │   │   │       RegisterForm()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │     useAuth.js
│   │   │   │       useAuth()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │     auth.api.js
│   │   │   │       login()
│   │   │   │       register()
│   │   │   │
│   │   │   └── store/
│   │   │
│   │   │         auth.store.js
│   │   │           setUser()
│   │   │           logout()
│   │   │
│   │   ├── admin/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │     AdminDashboardPage.jsx
│   │   │   │       AdminDashboardPage()
│   │   │   │
│   │   │   │     CreateAuctionPage.jsx
│   │   │   │       CreateAuctionPage()
│   │   │   │
│   │   │   │     AuctionListPage.jsx
│   │   │   │       AuctionListPage()
│   │   │   │
│   │   │   │     AuctionDetailsPage.jsx
│   │   │   │       AuctionDetailsPage()
│   │   │   │
│   │   │   │     AssignBiddersPage.jsx
│   │   │   │       AssignBiddersPage()
│   │   │   │
│   │   │   │     AddAuctionItemPage.jsx
│   │   │   │       AddAuctionItemPage()
│   │   │   │
│   │   │   │     UsersManagementPage.jsx
│   │   │   │       UsersManagementPage()
│   │   │   │
│   │   │   │     AuctionSchedulePage.jsx
│   │   │   │       AuctionSchedulePage()
│   │   │   │
│   │   │   │     ReportsPage.jsx
│   │   │   │       ReportsPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │     AdminSidebar.jsx
│   │   │   │       AdminSidebar()
│   │   │   │
│   │   │   │     AuctionForm.jsx
│   │   │   │       AuctionForm()
│   │   │   │
│   │   │   │     AuctionCard.jsx
│   │   │   │       AuctionCard()
│   │   │   │
│   │   │   │     AuctionTable.jsx
│   │   │   │       AuctionTable()
│   │   │   │
│   │   │   │     BidderAssignmentPanel.jsx
│   │   │   │       BidderAssignmentPanel()
│   │   │   │
│   │   │   │     ScheduleCalendar.jsx
│   │   │   │       ScheduleCalendar()
│   │   │   │
│   │   │   │     RevenueChart.jsx
│   │   │   │       RevenueChart()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │     useAuctionManagement.js
│   │   │   │       useAuctionManagement()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │     adminAuction.api.js
│   │   │   │       createAuction()
│   │   │   │       getAuctions()
│   │   │   │       closeAuction()
│   │   │   │
│   │   │   └── store/
│   │   │
│   │   │         adminAuction.store.js
│   │   │           setAuctions()
│   │   │           updateAuction()
│   │   │
│   │   ├── member/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │     MemberDashboardPage.jsx
│   │   │   │       MemberDashboardPage()
│   │   │   │
│   │   │   │     LiveAuctionsPage.jsx
│   │   │   │       LiveAuctionsPage()
│   │   │   │
│   │   │   │     AuctionLiveDetailsPage.jsx
│   │   │   │       AuctionLiveDetailsPage()
│   │   │   │
│   │   │   │     PlaceBidPage.jsx
│   │   │   │       PlaceBidPage()
│   │   │   │
│   │   │   │     WalletPage.jsx
│   │   │   │       WalletPage()
│   │   │   │
│   │   │   │     MyBidsPage.jsx
│   │   │   │       MyBidsPage()
│   │   │   │
│   │   │   │     MyWinsPage.jsx
│   │   │   │       MyWinsPage()
│   │   │   │
│   │   │   │     ProfilePage.jsx
│   │   │   │       ProfilePage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │     MemberNavbar.jsx
│   │   │   │       MemberNavbar()
│   │   │   │
│   │   │   │     AuctionLiveCard.jsx
│   │   │   │       AuctionLiveCard()
│   │   │   │
│   │   │   │     LiveBidPanel.jsx
│   │   │   │       LiveBidPanel()
│   │   │   │
│   │   │   │     BidHistoryList.jsx
│   │   │   │       BidHistoryList()
│   │   │   │
│   │   │   │     WalletBalanceCard.jsx
│   │   │   │       WalletBalanceCard()
│   │   │   │
│   │   │   │     BidInputBox.jsx
│   │   │   │       BidInputBox()
│   │   │   │
│   │   │   │     TopUpWalletModal.jsx
│   │   │   │       TopUpWalletModal()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │     useLiveAuction.js
│   │   │   │       connectAuctionSocket()
│   │   │   │       subscribeLiveUpdates()
│   │   │   │
│   │   │   │     usePlaceBid.js
│   │   │   │       placeBid()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │     auction.api.js
│   │   │   │       getLiveAuctions()
│   │   │   │       getAuctionDetails()
│   │   │   │
│   │   │   │     bid.api.js
│   │   │   │       placeBid()
│   │   │   │
│   │   │   │     wallet.api.js
│   │   │   │       topUpWallet()
│   │   │   │       getWalletBalance()
│   │   │   │
│   │   │   └── store/
│   │   │
│   │   │         auction.store.js
│   │   │           setLiveAuctions()
│   │   │           updateHighestBid()
│   │   │
│   │   ├── spectator/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │     SpectatorHomePage.jsx
│   │   │   │       SpectatorHomePage()
│   │   │   │
│   │   │   │     SpectatorAuctionViewPage.jsx
│   │   │   │       SpectatorAuctionViewPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │     SpectatorAuctionCard.jsx
│   │   │   │       SpectatorAuctionCard()
│   │   │   │
│   │   │   │     LiveWatcherPanel.jsx
│   │   │   │       LiveWatcherPanel()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │     useSpectatorLiveFeed.js
│   │   │   │       subscribeAuctionFeed()
│   │   │   │
│   │   │   └── services/
│   │   │
│   │   │         spectator.api.js
│   │   │           getPublicAuctions()
│   │   │
│   │   └── shared/
│   │
│   │       ├── components/
│   │       │
│   │       │     Button.jsx
│   │       │       Button()
│   │       │
│   │       │     Modal.jsx
│   │       │       Modal()
│   │       │
│   │       │     Loader.jsx
│   │       │       Loader()
│   │       │
│   │       │     EmptyState.jsx
│   │       │       EmptyState()
│   │       │
│   │       │     CountdownTimer.jsx
│   │       │       CountdownTimer()
│   │       │
│   │       │     ProtectedView.jsx
│   │       │       ProtectedView()
│   │       │
│   │       ├── hooks/
│   │       │
│   │       │     useSocket.js
│   │       │       connectSocket()
│   │       │       emitEvent()
│   │       │       subscribeEvent()
│   │       │
│   │       │     useDebounce.js
│   │       │       useDebounce()
│   │       │
│   │       ├── services/
│   │       │
│   │       │     apiClient.js
│   │       │       get()
│   │       │       post()
│   │       │       patch()
│   │       │
│   │       │     socketClient.js
│   │       │       connect()
│   │       │       joinAuctionRoom()
│   │       │       listenHighestBid()
│   │       │
│   │       ├── context/
│   │       │
│   │       │     SocketProvider.jsx
│   │       │       SocketProvider()
│   │       │
│   │       ├── constants/
│   │       │
│   │       │     roles.constant.js
│   │       │
│   │       │     routes.constant.js
│   │       │
│   │       │     socketEvents.constant.js
│   │       │
│   │       ├── utils/
│   │       │
│   │       │     currency.util.js
│   │       │       formatCurrency()
│   │       │
│   │       │     timer.util.js
│   │       │       calculateRemainingTime()
│   │       │
│   │       │     toast.util.js
│   │       │       showSuccessToast()
│   │       │       showErrorToast()
│   │       │
│   │       └── styles/
│   │
│   │             global.css
│   │             theme.css
│   │
│   └── assets/
│
│       ├── icons/
│       ├── images/
│       └── animations/
│
├── package.json
│
└── README.md
```
