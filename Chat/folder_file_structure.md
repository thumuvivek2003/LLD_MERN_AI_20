
> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Pub Sub, Strategy , State , Factory , Repository ,  Repo , service , singleton if required and other required   where it needs so give me backend tree structure 

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
│   │   ├── env.config.js
│   │   │     loadEnv()
│   │   │
│   │   ├── db.config.js
│   │   │     connectMongo()
│   │   │
│   │   ├── socket.config.js
│   │   │     initializeSocket()
│   │   │
│   │   └── cors.config.js
│   │         buildCorsOptions()
│   │
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── auth.controller.js
│   │   │   │     loginWithMobile()
│   │   │   │     verifyOtp()
│   │   │   │     logout()
│   │   │   │
│   │   │   ├── auth.service.js
│   │   │   │     generateOtp()
│   │   │   │     validateOtp()
│   │   │   │     generateTokens()
│   │   │   │
│   │   │   ├── auth.repository.js
│   │   │   │     findUserByMobile()
│   │   │   │     createUser()
│   │   │   │
│   │   │   ├── auth.routes.js
│   │   │   │     registerAuthRoutes()
│   │   │   │
│   │   │   └── auth.validator.js
│   │   │         validateMobile()
│   │   │         validateOtp()
│   │   │
│   │   │
│   │   ├── user/
│   │   │
│   │   │   ├── user.controller.js
│   │   │   │     getMyProfile()
│   │   │   │     getUsers()
│   │   │   │     getUserById()
│   │   │   │
│   │   │   ├── user.service.js
│   │   │   │     fetchUsers()
│   │   │   │     fetchProfile()
│   │   │   │
│   │   │   ├── user.repository.js
│   │   │   │     findById()
│   │   │   │     findAll()
│   │   │   │     updateLastSeen()
│   │   │   │
│   │   │   ├── user.routes.js
│   │   │   │     registerUserRoutes()
│   │   │   │
│   │   │   └── user.mapper.js
│   │   │         toUserResponse()
│   │   │
│   │   │
│   │   ├── chat/
│   │   │
│   │   │   ├── chat.controller.js
│   │   │   │     createDirectChat()
│   │   │   │     createGroupChat()
│   │   │   │     getChats()
│   │   │   │
│   │   │   ├── chat.service.js
│   │   │   │     createChat()
│   │   │   │     fetchUserChats()
│   │   │   │
│   │   │   ├── chat.factory.js
│   │   │   │     createDirectChat()
│   │   │   │     createGroupChat()
│   │   │   │
│   │   │   ├── chat.repository.js
│   │   │   │     create()
│   │   │   │     findById()
│   │   │   │     findUserChats()
│   │   │   │
│   │   │   ├── chat.routes.js
│   │   │   │     registerChatRoutes()
│   │   │   │
│   │   │   └── chat.constants.js
│   │   │         CHAT_TYPES
│   │   │
│   │   │
│   │   ├── group/
│   │   │
│   │   │   ├── group.controller.js
│   │   │   │     addMembers()
│   │   │   │     removeMember()
│   │   │   │     renameGroup()
│   │   │   │
│   │   │   ├── group.service.js
│   │   │   │     addUsersToGroup()
│   │   │   │     removeUserFromGroup()
│   │   │   │
│   │   │   ├── group.repository.js
│   │   │   │     addMember()
│   │   │   │     removeMember()
│   │   │   │
│   │   │   └── group.routes.js
│   │   │         registerGroupRoutes()
│   │   │
│   │   │
│   │   ├── message/
│   │   │
│   │   │   ├── message.controller.js
│   │   │   │     sendMessage()
│   │   │   │     getMessages()
│   │   │   │
│   │   │   ├── message.service.js
│   │   │   │     createMessage()
│   │   │   │     fetchMessages()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │
│   │   │   │   ├── direct-message.strategy.js
│   │   │   │   │     process()
│   │   │   │   │
│   │   │   │   ├── group-message.strategy.js
│   │   │   │   │     process()
│   │   │   │   │
│   │   │   │   └── offline-message.strategy.js
│   │   │   │         process()
│   │   │   │
│   │   │   ├── states/
│   │   │   │
│   │   │   │   ├── sent.state.js
│   │   │   │   │     transition()
│   │   │   │   │
│   │   │   │   ├── delivered.state.js
│   │   │   │   │     transition()
│   │   │   │   │
│   │   │   │   └── read.state.js
│   │   │   │         transition()
│   │   │   │
│   │   │   ├── message.repository.js
│   │   │   │     create()
│   │   │   │     findChatMessages()
│   │   │   │
│   │   │   ├── message.routes.js
│   │   │   │     registerMessageRoutes()
│   │   │   │
│   │   │   └── message.mapper.js
│   │   │         toMessageResponse()
│   │   │
│   │   │
│   │   ├── delivery/
│   │   │
│   │   │   ├── delivery.service.js
│   │   │   │     markDelivered()
│   │   │   │     markRead()
│   │   │   │
│   │   │   ├── delivery.repository.js
│   │   │   │     updateStatus()
│   │   │   │     createStatus()
│   │   │   │
│   │   │   └── delivery.constants.js
│   │   │         MESSAGE_STATUS
│   │   │
│   │   │
│   │   ├── presence/
│   │   │
│   │   │   ├── presence.service.js
│   │   │   │     markOnline()
│   │   │   │     markOffline()
│   │   │   │     getOnlineUsers()
│   │   │   │
│   │   │   ├── presence.repository.js
│   │   │   │     updatePresence()
│   │   │   │
│   │   │   └── presence.cache.js
│   │   │         addConnection()
│   │   │         removeConnection()
│   │   │         getConnections()
│   │   │
│   │   │
│   │   ├── socket/
│   │   │
│   │   │   ├── socket.gateway.js
│   │   │   │     onConnection()
│   │   │   │     onDisconnect()
│   │   │   │     registerEvents()
│   │   │   │
│   │   │   ├── socket.manager.js
│   │   │   │     addSocket()
│   │   │   │     removeSocket()
│   │   │   │     getUserSockets()
│   │   │   │
│   │   │   ├── socket.emitter.js
│   │   │   │     emitToUser()
│   │   │   │     emitToGroup()
│   │   │   │
│   │   │   └── socket.events.js
│   │   │         MESSAGE_SEND
│   │   │         MESSAGE_RECEIVED
│   │   │         MESSAGE_READ
│   │   │         USER_TYPING
│   │   │
│   │   │
│   │   └── admin/
│   │       │
│   │       ├── admin.controller.js
│   │       │     getUsers()
│   │       │     blockUser()
│   │       │     unblockUser()
│   │       │
│   │       ├── admin.service.js
│   │       │     fetchUsers()
│   │       │     updateUserStatus()
│   │       │
│   │       ├── admin.repository.js
│   │       │     findUsers()
│   │       │     updateBlockStatus()
│   │       │
│   │       └── admin.routes.js
│   │             registerAdminRoutes()
│   │
│   │
│   ├── events/
│   │
│   │   ├── event-bus.js
│   │   │     publish()
│   │   │     subscribe()
│   │   │
│   │   ├── event.constants.js
│   │   │     MESSAGE_CREATED
│   │   │     MESSAGE_DELIVERED
│   │   │     MESSAGE_READ
│   │   │     USER_ONLINE
│   │   │
│   │   └── subscribers/
│   │
│   │       ├── message-created.subscriber.js
│   │       │     handle()
│   │       │
│   │       ├── delivery.subscriber.js
│   │       │     handle()
│   │       │
│   │       ├── presence.subscriber.js
│   │       │     handle()
│   │       │
│   │       └── socket.subscriber.js
│   │             handle()
│   │
│   │
│   ├── models/
│   │
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   ├── group-member.model.js
│   │   ├── message.model.js
│   │   ├── delivery.model.js
│   │   └── socket-session.model.js
│   │
│   │
│   ├── middleware/
│   │
│   │   ├── auth.middleware.js
│   │   │     authenticate()
│   │   │
│   │   ├── error.middleware.js
│   │   │     handleError()
│   │   │
│   │   ├── role.middleware.js
│   │   │     authorize()
│   │   │
│   │   └── validate.middleware.js
│   │         validate()
│   │
│   │
│   ├── shared/
│   │
│   │   ├── utils/
│   │   │
│   │   │   ├── jwt.util.js
│   │   │   │     generateAccessToken()
│   │   │   │     verifyAccessToken()
│   │   │   │
│   │   │   ├── otp.util.js
│   │   │   │     generateOtp()
│   │   │   │
│   │   │   ├── response.util.js
│   │   │   │     successResponse()
│   │   │   │     errorResponse()
│   │   │   │
│   │   │   └── date.util.js
│   │   │         getCurrentTimestamp()
│   │   │
│   │   ├── constants/
│   │   │
│   │   │   ├── roles.constant.js
│   │   │   ├── errors.constant.js
│   │   │   └── app.constant.js
│   │   │
│   │   └── logger/
│   │         logger.js
│   │         createLogger()
│   │
│   │
│   └── routes/
│       │
│       └── index.js
│             registerRoutes()
│
│
├── package.json
├── .env
├── .gitignore
└── README.md
```

> **Prompt** Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm  socket io 

```text id="l7fz4q"
frontend/
│
├── src/
│
│   ├── main.jsx
│   │     bootstrapApplication()
│   │
│   ├── App.jsx
│   │     App()
│   │
│   ├── routes/
│   │
│   │   ├── app.routes.jsx
│   │   │     AppRoutes()
│   │   │
│   │   ├── protected.routes.jsx
│   │   │     ProtectedRoutes()
│   │   │
│   │   └── role.routes.jsx
│   │         RoleRoutes()
│   │
│   │
│   ├── layouts/
│   │
│   │   ├── user-layout/
│   │   │
│   │   │   ├── UserLayout.jsx
│   │   │   │     UserLayout()
│   │   │   │
│   │   │   ├── UserSidebar.jsx
│   │   │   │     UserSidebar()
│   │   │   │
│   │   │   └── UserHeader.jsx
│   │   │         UserHeader()
│   │   │
│   │   │
│   │   └── admin-layout/
│   │
│   │       ├── AdminLayout.jsx
│   │       │     AdminLayout()
│   │       │
│   │       ├── AdminSidebar.jsx
│   │       │     AdminSidebar()
│   │       │
│   │       └── AdminHeader.jsx
│   │             AdminHeader()
│   │
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   │     LoginPage()
│   │   │   │   │
│   │   │   │   └── OtpVerifyPage.jsx
│   │   │   │         OtpVerifyPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── MobileInput.jsx
│   │   │   │   │     MobileInput()
│   │   │   │   │
│   │   │   │   ├── OtpInput.jsx
│   │   │   │   │     OtpInput()
│   │   │   │   │
│   │   │   │   └── LoginCard.jsx
│   │   │   │         LoginCard()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │   └── useAuth.js
│   │   │   │         useAuth()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── auth.service.js
│   │   │   │         loginWithMobile()
│   │   │   │         verifyOtp()
│   │   │   │
│   │   │   ├── store/
│   │   │   │
│   │   │   │   └── auth.store.js
│   │   │   │         useAuthStore()
│   │   │   │
│   │   │   └── auth.routes.jsx
│   │   │         AuthRoutes()
│   │   │
│   │   │
│   │   ├── user/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   ├── ContactsPage.jsx
│   │   │   │   │     ContactsPage()
│   │   │   │   │
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   │     ProfilePage()
│   │   │   │   │
│   │   │   │   └── SettingsPage.jsx
│   │   │   │         SettingsPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── UserCard.jsx
│   │   │   │   │     UserCard()
│   │   │   │   │
│   │   │   │   ├── OnlineBadge.jsx
│   │   │   │   │     OnlineBadge()
│   │   │   │   │
│   │   │   │   └── LastSeenLabel.jsx
│   │   │   │         LastSeenLabel()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │   └── useUsers.js
│   │   │   │         useUsers()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── user.service.js
│   │   │   │         fetchUsers()
│   │   │   │         fetchProfile()
│   │   │   │
│   │   │   └── store/
│   │   │         user.store.js
│   │   │         useUserStore()
│   │   │
│   │   │
│   │   ├── chat/
│   │   │
│   │   │   ├── pages/
│   │   │   │
│   │   │   │   ├── ChatHomePage.jsx
│   │   │   │   │     ChatHomePage()
│   │   │   │   │
│   │   │   │   ├── DirectChatPage.jsx
│   │   │   │   │     DirectChatPage()
│   │   │   │   │
│   │   │   │   ├── GroupChatPage.jsx
│   │   │   │   │     GroupChatPage()
│   │   │   │   │
│   │   │   │   ├── NewChatPage.jsx
│   │   │   │   │     NewChatPage()
│   │   │   │   │
│   │   │   │   ├── CreateGroupPage.jsx
│   │   │   │   │     CreateGroupPage()
│   │   │   │   │
│   │   │   │   ├── GroupInfoPage.jsx
│   │   │   │   │     GroupInfoPage()
│   │   │   │   │
│   │   │   │   └── MessageStatusPage.jsx
│   │   │   │         MessageStatusPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │
│   │   │   │   ├── ChatList.jsx
│   │   │   │   │     ChatList()
│   │   │   │   │
│   │   │   │   ├── ChatCard.jsx
│   │   │   │   │     ChatCard()
│   │   │   │   │
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   │     ChatHeader()
│   │   │   │   │
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   │     MessageBubble()
│   │   │   │   │
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   │     MessageInput()
│   │   │   │   │
│   │   │   │   ├── MessageStatusIcon.jsx
│   │   │   │   │     MessageStatusIcon()
│   │   │   │   │
│   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   │     TypingIndicator()
│   │   │   │   │
│   │   │   │   ├── GroupMemberList.jsx
│   │   │   │   │     GroupMemberList()
│   │   │   │   │
│   │   │   │   ├── AddMemberModal.jsx
│   │   │   │   │     AddMemberModal()
│   │   │   │   │
│   │   │   │   └── CreateGroupForm.jsx
│   │   │   │         CreateGroupForm()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │
│   │   │   │   ├── useChats.js
│   │   │   │   │     useChats()
│   │   │   │   │
│   │   │   │   ├── useMessages.js
│   │   │   │   │     useMessages()
│   │   │   │   │
│   │   │   │   ├── useTyping.js
│   │   │   │   │     useTyping()
│   │   │   │   │
│   │   │   │   └── useGroup.js
│   │   │   │         useGroup()
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── chat.service.js
│   │   │   │   │     fetchChats()
│   │   │   │   │     createDirectChat()
│   │   │   │   │     createGroupChat()
│   │   │   │   │
│   │   │   │   ├── message.service.js
│   │   │   │   │     fetchMessages()
│   │   │   │   │     sendMessage()
│   │   │   │   │
│   │   │   │   └── group.service.js
│   │   │   │         addMembers()
│   │   │   │         removeMember()
│   │   │   │
│   │   │   ├── store/
│   │   │   │
│   │   │   │   ├── chat.store.js
│   │   │   │   │     useChatStore()
│   │   │   │   │
│   │   │   │   ├── message.store.js
│   │   │   │   │     useMessageStore()
│   │   │   │   │
│   │   │   │   └── typing.store.js
│   │   │   │         useTypingStore()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │
│   │   │   │   ├── direct-chat.strategy.js
│   │   │   │   │     render()
│   │   │   │   │
│   │   │   │   └── group-chat.strategy.js
│   │   │   │         render()
│   │   │   │
│   │   │   └── chat.routes.jsx
│   │   │         ChatRoutes()
│   │   │
│   │   │
│   │   ├── socket/
│   │   │
│   │   │   ├── socket.client.js
│   │   │   │     connectSocket()
│   │   │   │     disconnectSocket()
│   │   │   │
│   │   │   ├── socket.provider.jsx
│   │   │   │     SocketProvider()
│   │   │   │
│   │   │   ├── socket.context.js
│   │   │   │     SocketContext
│   │   │   │
│   │   │   ├── socket.events.js
│   │   │   │     MESSAGE_RECEIVED
│   │   │   │     MESSAGE_READ
│   │   │   │     USER_TYPING
│   │   │   │     USER_ONLINE
│   │   │   │
│   │   │   ├── socket.listeners.js
│   │   │   │     registerSocketListeners()
│   │   │   │
│   │   │   └── socket.emitter.js
│   │   │         emitMessage()
│   │   │         emitTyping()
│   │   │         emitReadReceipt()
│   │   │
│   │   │
│   │   └── admin/
│   │
│   │       ├── pages/
│   │       │
│   │       │   ├── DashboardPage.jsx
│   │       │   │     DashboardPage()
│   │       │   │
│   │       │   ├── UsersPage.jsx
│   │       │   │     UsersPage()
│   │       │   │
│   │       │   ├── UserDetailsPage.jsx
│   │       │   │     UserDetailsPage()
│   │       │   │
│   │       │   ├── GroupsPage.jsx
│   │       │   │     GroupsPage()
│   │       │   │
│   │       │   └── SettingsPage.jsx
│   │       │         SettingsPage()
│   │       │
│   │       ├── components/
│   │       │
│   │       │   ├── StatsCard.jsx
│   │       │   │     StatsCard()
│   │       │   │
│   │       │   ├── UserTable.jsx
│   │       │   │     UserTable()
│   │       │   │
│   │       │   ├── UserActionMenu.jsx
│   │       │   │     UserActionMenu()
│   │       │   │
│   │       │   └── GroupTable.jsx
│   │       │         GroupTable()
│   │       │
│   │       ├── hooks/
│   │       │
│   │       │   └── useAdmin.js
│   │       │         useAdmin()
│   │       │
│   │       ├── services/
│   │       │
│   │       │   └── admin.service.js
│   │       │         fetchUsers()
│   │       │         blockUser()
│   │       │         unblockUser()
│   │       │
│   │       ├── store/
│   │       │
│   │       │   └── admin.store.js
│   │       │         useAdminStore()
│   │       │
│   │       └── admin.routes.jsx
│   │             AdminRoutes()
│   │
│   │
│   ├── shared/
│   │
│   │   ├── components/
│   │   │
│   │   │   ├── Button.jsx
│   │   │   │     Button()
│   │   │   │
│   │   │   ├── Input.jsx
│   │   │   │     Input()
│   │   │   │
│   │   │   ├── Modal.jsx
│   │   │   │     Modal()
│   │   │   │
│   │   │   ├── Loader.jsx
│   │   │   │     Loader()
│   │   │   │
│   │   │   ├── EmptyState.jsx
│   │   │   │     EmptyState()
│   │   │   │
│   │   │   └── Avatar.jsx
│   │   │         Avatar()
│   │   │
│   │   ├── hooks/
│   │   │
│   │   │   ├── useDebounce.js
│   │   │   │     useDebounce()
│   │   │   │
│   │   │   └── usePagination.js
│   │   │         usePagination()
│   │   │
│   │   ├── constants/
│   │   │
│   │   │   ├── routes.constant.js
│   │   │   ├── roles.constant.js
│   │   │   └── socket.constant.js
│   │   │
│   │   ├── utils/
│   │   │
│   │   │   ├── format-date.util.js
│   │   │   │     formatDate()
│   │   │   │
│   │   │   ├── storage.util.js
│   │   │   │     setStorage()
│   │   │   │     getStorage()
│   │   │   │
│   │   │   └── message-status.util.js
│   │   │         resolveMessageStatus()
│   │   │
│   │   └── styles/
│   │         global.css
│   │         theme.css
│   │
│   │
│   └── providers/
│       │
│       ├── AppProvider.jsx
│       │     AppProvider()
│       │
│       └── QueryProvider.jsx
│             QueryProvider()
│
│
├── public/
│
├── package.json
├── vite.config.js
├── .env
└── README.md
```

