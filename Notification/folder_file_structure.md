> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository ,  Repo , service ,Observer  singleton if required and other required   where it needs so give me backend tree structure to simulate  above and show
```txt
notification-system-backend/
│
├── package.json
├── .env
├── server.js                                  → bootstrapServer()
│
├── src/
│   │
│   ├── config/
│   │   ├── db.config.js                       → connectDatabase()
│   │   ├── app.config.js                      → loadAppConfig()
│   │   ├── queue.config.js                    → createQueue()
│   │   └── logger.config.js                   → createLogger()
│   │
│   ├── constants/
│   │   ├── notificationStatus.constants.js
│   │   ├── channelType.constants.js
│   │   ├── eventType.constants.js
│   │   └── retry.constants.js
│   │
│   ├── modules/
│   │   │
│   │   ├── notification/
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   └── notification.controller.js
│   │   │   │       → triggerNotification()
│   │   │   │       → getNotificationById()
│   │   │   │       → getNotifications()
│   │   │   │       → retryNotification()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.js
│   │   │   │       → registerNotificationRoutes()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── notification.service.js
│   │   │   │   │   → createNotification()
│   │   │   │   │   → processNotification()
│   │   │   │   │   → retryNotification()
│   │   │   │   │
│   │   │   │   ├── notificationOrchestrator.service.js
│   │   │   │   │   → handleEventNotificationFlow()
│   │   │   │   │
│   │   │   │   ├── notificationStatus.service.js
│   │   │   │   │   → markQueued()
│   │   │   │   │   → markSending()
│   │   │   │   │   → markSent()
│   │   │   │   │   → markFailed()
│   │   │   │   │
│   │   │   │   ├── retry.service.js
│   │   │   │   │   → calculateRetryDelay()
│   │   │   │   │   → retryFailedNotification()
│   │   │   │   │
│   │   │   │   └── notificationQuery.service.js
│   │   │   │       → getRecentNotifications()
│   │   │   │       → getNotificationsByStatus()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   └── notification.repository.js
│   │   │   │       → create()
│   │   │   │       → findById()
│   │   │   │       → updateStatus()
│   │   │   │       → incrementRetryCount()
│   │   │   │       → findFailedNotifications()
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── notification.model.js
│   │   │   │       → NotificationSchema
│   │   │   │
│   │   │   ├── factories/
│   │   │   │   └── notificationChannel.factory.js
│   │   │   │       → createChannelStrategy()
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   │
│   │   │   │   ├── base/
│   │   │   │   │   └── notification.strategy.js
│   │   │   │   │       → send()
│   │   │   │   │
│   │   │   │   ├── email.strategy.js
│   │   │   │   │   → send()
│   │   │   │   │
│   │   │   │   ├── sms.strategy.js
│   │   │   │   │   → send()
│   │   │   │   │
│   │   │   │   └── push.strategy.js
│   │   │   │       → send()
│   │   │   │
│   │   │   ├── workers/
│   │   │   │   ├── notification.worker.js
│   │   │   │   │   → processQueuedNotification()
│   │   │   │   │
│   │   │   │   └── retry.worker.js
│   │   │   │       → processRetryNotification()
│   │   │   │
│   │   │   ├── state/
│   │   │   │   ├── queued.state.js
│   │   │   │   │   → handle()
│   │   │   │   ├── sending.state.js
│   │   │   │   │   → handle()
│   │   │   │   ├── sent.state.js
│   │   │   │   │   → handle()
│   │   │   │   └── failed.state.js
│   │   │   │       → handle()
│   │   │   │
│   │   │   ├── observers/
│   │   │   │   ├── notificationEvent.listener.js
│   │   │   │   │   → onNotificationEvent()
│   │   │   │   │
│   │   │   │   ├── email.listener.js
│   │   │   │   │   → handleEmailNotification()
│   │   │   │   │
│   │   │   │   ├── sms.listener.js
│   │   │   │   │   → handleSMSNotification()
│   │   │   │   │
│   │   │   │   └── push.listener.js
│   │   │   │       → handlePushNotification()
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── notification.publisher.js
│   │   │   │   │   → publish()
│   │   │   │   │   → subscribe()
│   │   │   │   │
│   │   │   │   └── notification.events.js
│   │   │   │
│   │   │   ├── validators/
│   │   │   │   └── notification.validator.js
│   │   │   │       → validateNotificationPayload()
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── createNotification.dto.js
│   │   │   │   └── retryNotification.dto.js
│   │   │   │
│   │   │   └── mappers/
│   │   │       └── notification.mapper.js
│   │   │           → toNotificationResponse()
│   │   │
│   │   │
│   │   ├── template/
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   └── template.controller.js
│   │   │   │       → createTemplate()
│   │   │   │       → createTemplateVersion()
│   │   │   │       → getTemplates()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── template.routes.js
│   │   │   │       → registerTemplateRoutes()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── template.service.js
│   │   │   │   │   → createTemplate()
│   │   │   │   │   → getActiveTemplate()
│   │   │   │   │
│   │   │   │   ├── templateRenderer.service.js
│   │   │   │   │   → render()
│   │   │   │   │
│   │   │   │   └── templateVersion.service.js
│   │   │   │       → createVersion()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   └── template.repository.js
│   │   │   │       → create()
│   │   │   │       → findActiveTemplate()
│   │   │   │       → findTemplateVersion()
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── template.model.js
│   │   │   │       → TemplateSchema
│   │   │   │
│   │   │   └── validators/
│   │   │       └── template.validator.js
│   │   │           → validateTemplate()
│   │   │
│   │   │
│   │   ├── user/
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   └── userPreference.controller.js
│   │   │   │       → updatePreferences()
│   │   │   │       → getPreferences()
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── user.routes.js
│   │   │   │       → registerUserRoutes()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── userPreference.service.js
│   │   │   │       → updatePreferences()
│   │   │   │       → getPreferences()
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.js
│   │   │   │       → findById()
│   │   │   │       → updatePreferences()
│   │   │   │
│   │   │   └── models/
│   │   │       └── user.model.js
│   │   │           → UserSchema
│   │   │
│   │   │
│   │   └── admin/
│   │       │
│   │       ├── controllers/
│   │       │   └── admin.controller.js
│   │       │       → getDashboard()
│   │       │       → retryFailedNotifications()
│   │       │       → getSystemStats()
│   │       │
│   │       ├── routes/
│   │       │   └── admin.routes.js
│   │       │       → registerAdminRoutes()
│   │       │
│   │       └── services/
│   │           └── adminDashboard.service.js
│   │               → getDashboardMetrics()
│   │               → getRecentFailures()
│   │
│   │
│   ├── shared/
│   │   │
│   │   ├── queue/
│   │   │   ├── inMemory.queue.js
│   │   │   │   → enqueue()
│   │   │   │   → dequeue()
│   │   │   │
│   │   │   └── queueManager.js
│   │   │       → getQueueInstance()
│   │   │
│   │   ├── logger/
│   │   │   └── logger.js
│   │   │       → info()
│   │   │       → error()
│   │   │       → warn()
│   │   │
│   │   ├── utils/
│   │   │   ├── retry.util.js
│   │   │   │   → calculateExponentialBackoff()
│   │   │   │
│   │   │   ├── template.util.js
│   │   │   │   → injectVariables()
│   │   │   │
│   │   │   ├── id.util.js
│   │   │   │   → generateId()
│   │   │   │
│   │   │   └── date.util.js
│   │   │       → getCurrentTimestamp()
│   │   │
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   │   → handleError()
│   │   │   │
│   │   │   └── requestLogger.middleware.js
│   │   │       → logRequest()
│   │   │
│   │   └── exceptions/
│   │       ├── app.exception.js
│   │       ├── validation.exception.js
│   │       └── notification.exception.js
│   │
│   │
│   └── app.js                                  → createExpressApp()
│
└── README.md
```



> **Prompt** Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 

```txt id="h4n3gk"
notification-system-frontend/
│
├── package.json
├── vite.config.js
├── index.html
│
├── public/
│   └── icons/
│
├── src/
│   │
│   ├── main.jsx                               → bootstrapReactApp()
│   ├── App.jsx                                → App()
│   │
│   ├── config/
│   │   ├── api.config.js                      → getApiBaseUrl()
│   │   ├── route.config.js                    → getAppRoutes()
│   │   └── sidebar.config.js                  → getSidebarItems()
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx                      → AppRoutes()
│   │   ├── UserRoutes.jsx                     → UserRoutes()
│   │   ├── AdminRoutes.jsx                    → AdminRoutes()
│   │   └── SystemRoutes.jsx                   → SystemRoutes()
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx                     → MainLayout()
│   │   ├── DashboardLayout.jsx                → DashboardLayout()
│   │   └── AuthLayout.jsx                     → AuthLayout()
│   │
│   ├── modules/
│   │   │
│   │   ├── user/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── UserDashboardPage.jsx
│   │   │   │   │   → UserDashboardPage()
│   │   │   │   │
│   │   │   │   ├── UserNotificationsPage.jsx
│   │   │   │   │   → UserNotificationsPage()
│   │   │   │   │
│   │   │   │   └── NotificationPreferencesPage.jsx
│   │   │   │       → NotificationPreferencesPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── NotificationCard.jsx
│   │   │   │   │   → NotificationCard()
│   │   │   │   │
│   │   │   │   ├── PreferenceToggleCard.jsx
│   │   │   │   │   → PreferenceToggleCard()
│   │   │   │   │
│   │   │   │   ├── NotificationChannelTabs.jsx
│   │   │   │   │   → NotificationChannelTabs()
│   │   │   │   │
│   │   │   │   └── NotificationPreviewCard.jsx
│   │   │   │       → NotificationPreviewCard()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── userNotification.service.js
│   │   │   │       → fetchNotifications()
│   │   │   │       → fetchPreferences()
│   │   │   │       → updatePreferences()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useNotifications.js
│   │   │   │   │   → useNotifications()
│   │   │   │   │
│   │   │   │   └── useNotificationPreferences.js
│   │   │   │       → useNotificationPreferences()
│   │   │   │
│   │   │   └── state/
│   │   │       └── userNotification.store.js
│   │   │           → useUserNotificationStore()
│   │   │
│   │   │
│   │   ├── admin/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   │   → AdminDashboardPage()
│   │   │   │   │
│   │   │   │   ├── NotificationManagementPage.jsx
│   │   │   │   │   → NotificationManagementPage()
│   │   │   │   │
│   │   │   │   ├── NotificationDetailsPage.jsx
│   │   │   │   │   → NotificationDetailsPage()
│   │   │   │   │
│   │   │   │   ├── RetryFailedPage.jsx
│   │   │   │   │   → RetryFailedPage()
│   │   │   │   │
│   │   │   │   └── SystemAnalyticsPage.jsx
│   │   │   │       → SystemAnalyticsPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── DashboardStatsCard.jsx
│   │   │   │   │   → DashboardStatsCard()
│   │   │   │   │
│   │   │   │   ├── NotificationStatusBadge.jsx
│   │   │   │   │   → NotificationStatusBadge()
│   │   │   │   │
│   │   │   │   ├── NotificationTable.jsx
│   │   │   │   │   → NotificationTable()
│   │   │   │   │
│   │   │   │   ├── RetryTimeline.jsx
│   │   │   │   │   → RetryTimeline()
│   │   │   │   │
│   │   │   │   ├── NotificationFilterBar.jsx
│   │   │   │   │   → NotificationFilterBar()
│   │   │   │   │
│   │   │   │   └── RetryNotificationButton.jsx
│   │   │   │       → RetryNotificationButton()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── adminNotification.service.js
│   │   │   │       → fetchDashboardMetrics()
│   │   │   │       → fetchNotifications()
│   │   │   │       → retryNotification()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAdminDashboard.js
│   │   │   │   │   → useAdminDashboard()
│   │   │   │   │
│   │   │   │   └── useNotificationFilters.js
│   │   │   │       → useNotificationFilters()
│   │   │   │
│   │   │   └── state/
│   │   │       └── adminDashboard.store.js
│   │   │           → useAdminDashboardStore()
│   │   │
│   │   │
│   │   ├── template/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── TemplateListPage.jsx
│   │   │   │   │   → TemplateListPage()
│   │   │   │   │
│   │   │   │   ├── TemplateEditorPage.jsx
│   │   │   │   │   → TemplateEditorPage()
│   │   │   │   │
│   │   │   │   └── TemplateVersionHistoryPage.jsx
│   │   │   │       → TemplateVersionHistoryPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── TemplateCard.jsx
│   │   │   │   │   → TemplateCard()
│   │   │   │   │
│   │   │   │   ├── TemplateEditorForm.jsx
│   │   │   │   │   → TemplateEditorForm()
│   │   │   │   │
│   │   │   │   ├── TemplatePreviewPane.jsx
│   │   │   │   │   → TemplatePreviewPane()
│   │   │   │   │
│   │   │   │   ├── VariableHelperPanel.jsx
│   │   │   │   │   → VariableHelperPanel()
│   │   │   │   │
│   │   │   │   └── TemplateVersionTable.jsx
│   │   │   │       → TemplateVersionTable()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── template.service.js
│   │   │   │       → fetchTemplates()
│   │   │   │       → createTemplate()
│   │   │   │       → createTemplateVersion()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useTemplates.js
│   │   │   │       → useTemplates()
│   │   │   │
│   │   │   └── state/
│   │   │       └── template.store.js
│   │   │           → useTemplateStore()
│   │   │
│   │   │
│   │   ├── notification/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── SendNotificationPage.jsx
│   │   │   │   │   → SendNotificationPage()
│   │   │   │   │
│   │   │   │   ├── SendGroupNotificationPage.jsx
│   │   │   │   │   → SendGroupNotificationPage()
│   │   │   │   │
│   │   │   │   └── NotificationReviewPage.jsx
│   │   │   │       → NotificationReviewPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── AudienceSelector.jsx
│   │   │   │   │   → AudienceSelector()
│   │   │   │   │
│   │   │   │   ├── ChannelSelector.jsx
│   │   │   │   │   → ChannelSelector()
│   │   │   │   │
│   │   │   │   ├── NotificationComposer.jsx
│   │   │   │   │   → NotificationComposer()
│   │   │   │   │
│   │   │   │   ├── NotificationReviewCard.jsx
│   │   │   │   │   → NotificationReviewCard()
│   │   │   │   │
│   │   │   │   ├── TemplateSelector.jsx
│   │   │   │   │   → TemplateSelector()
│   │   │   │   │
│   │   │   │   └── DeliveryChannelCard.jsx
│   │   │   │       → DeliveryChannelCard()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── notification.service.js
│   │   │   │       → sendNotification()
│   │   │   │       → sendGroupNotification()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useNotificationComposer.js
│   │   │   │   │   → useNotificationComposer()
│   │   │   │   │
│   │   │   │   └── useSendNotification.js
│   │   │   │       → useSendNotification()
│   │   │   │
│   │   │   └── state/
│   │   │       └── notificationComposer.store.js
│   │   │           → useNotificationComposerStore()
│   │   │
│   │   │
│   │   └── system/
│   │       │
│   │       ├── pages/
│   │       │   ├── QueueMonitorPage.jsx
│   │       │   │   → QueueMonitorPage()
│   │       │   │
│   │       │   ├── RetryQueuePage.jsx
│   │       │   │   → RetryQueuePage()
│   │       │   │
│   │       │   └── DeliveryLogsPage.jsx
│   │       │       → DeliveryLogsPage()
│   │       │
│   │       ├── components/
│   │       │   ├── QueueStatusCard.jsx
│   │       │   │   → QueueStatusCard()
│   │       │   │
│   │       │   ├── DeliveryLogTable.jsx
│   │       │   │   → DeliveryLogTable()
│   │       │   │
│   │       │   ├── WorkerHealthCard.jsx
│   │       │   │   → WorkerHealthCard()
│   │       │   │
│   │       │   └── RetryQueueTable.jsx
│   │       │       → RetryQueueTable()
│   │       │
│   │       ├── services/
│   │       │   └── system.service.js
│   │       │       → fetchQueueStatus()
│   │       │       → fetchRetryJobs()
│   │       │       → fetchDeliveryLogs()
│   │       │
│   │       └── hooks/
│   │           └── useQueueMonitor.js
│   │               → useQueueMonitor()
│   │
│   │
│   ├── shared/
│   │   │
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   │   → createAxiosClient()
│   │   │   │
│   │   │   └── apiResponseHandler.js
│   │   │       → handleApiResponse()
│   │   │
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   │   → Button()
│   │   │   │
│   │   │   ├── Card.jsx
│   │   │   │   → Card()
│   │   │   │
│   │   │   ├── Modal.jsx
│   │   │   │   → Modal()
│   │   │   │
│   │   │   ├── Table.jsx
│   │   │   │   → Table()
│   │   │   │
│   │   │   ├── Loader.jsx
│   │   │   │   → Loader()
│   │   │   │
│   │   │   ├── EmptyState.jsx
│   │   │   │   → EmptyState()
│   │   │   │
│   │   │   ├── Sidebar.jsx
│   │   │   │   → Sidebar()
│   │   │   │
│   │   │   ├── Topbar.jsx
│   │   │   │   → Topbar()
│   │   │   │
│   │   │   └── StatusPill.jsx
│   │   │       → StatusPill()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   │   → useDebounce()
│   │   │   │
│   │   │   └── useModal.js
│   │   │       → useModal()
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   │   → formatDate()
│   │   │   │
│   │   │   ├── formatStatus.js
│   │   │   │   → formatStatus()
│   │   │   │
│   │   │   ├── renderTemplate.js
│   │   │   │   → renderTemplate()
│   │   │   │
│   │   │   └── retryDelay.js
│   │   │       → calculateRetryDelay()
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.constants.js
│   │   │   ├── notification.constants.js
│   │   │   └── status.constants.js
│   │   │
│   │   └── styles/
│   │       ├── global.css
│   │       └── theme.css
│   │
│   └── app/
│       ├── providers/
│       │   ├── QueryProvider.jsx
│       │   │   → QueryProvider()
│       │   │
│       │   └── ThemeProvider.jsx
│       │       → ThemeProvider()
│       │
│       └── store/
│           └── root.store.js
│               → createRootStore()
│
└── README.md
```

