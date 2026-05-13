> **Prompt** ngle file within only a tree structure with file names and function names with , for the backend for MERN socket io  (node , mongo db ) using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository , Observer(Pub/Sub) , Repo , service , singleton where it needs so give me backend tree structure


```text
backend/
│
├── src/
│   │
│   ├── app.js                                   # express app config
│   ├── server.js                                # server bootstrap + socket init
│   │
│   ├── config/
│   │   ├── env.config.js                        # load env variables
│   │   ├── db.config.js                         # mongo connection singleton
│   │   ├── socket.config.js                     # socket io singleton setup
│   │   └── constants.js                         # app constants/enums
│   │
│   ├── core/
│   │   │
│   │   ├── database/
│   │   │   └── mongo.client.js                  # singleton mongo connection
│   │   │
│   │   ├── socket/
│   │   │   ├── socket.manager.js                # singleton socket manager
│   │   │   ├── socket.events.js                 # all socket event names
│   │   │   └── socket.handlers.js               # register socket listeners
│   │   │
│   │   ├── event-bus/
│   │   │   ├── eventBus.js                      # pub/sub event emitter singleton
│   │   │   ├── publishers/
│   │   │   │   ├── ride.publisher.js
│   │   │   │   └── payment.publisher.js
│   │   │   │
│   │   │   └── subscribers/
│   │   │       ├── notification.subscriber.js
│   │   │       ├── socket.subscriber.js
│   │   │       └── otp.subscriber.js
│   │   │
│   │   ├── base/
│   │   │   ├── base.repository.js              # generic repository methods
│   │   │   ├── base.service.js                 # reusable service logic
│   │   │   ├── base.controller.js              # common controller helpers
│   │   │   └── api.response.js                 # standard api response
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   ├── otp.util.js
│   │   │   ├── distance.util.js
│   │   │   ├── fare.util.js
│   │   │   └── logger.util.js
│   │   │
│   │   └── exceptions/
│   │       ├── app.error.js
│   │       ├── auth.error.js
│   │       └── ride.error.js
│   │
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.mapper.js
│   │   │
│   │   ├── user/
│   │   │   ├── user.model.js
│   │   │   ├── user.routes.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.validation.js
│   │   │   └── user.mapper.js
│   │   │
│   │   ├── driver/
│   │   │   ├── driver.model.js
│   │   │   ├── driver.routes.js
│   │   │   ├── driver.controller.js
│   │   │   ├── driver.service.js
│   │   │   ├── driver.repository.js
│   │   │   ├── driver-location.service.js      # realtime location updates
│   │   │   ├── driver-status.enum.js
│   │   │   ├── driver.validation.js
│   │   │   └── driver.mapper.js
│   │   │
│   │   ├── vehicle/
│   │   │   ├── vehicle.model.js
│   │   │   ├── vehicle.controller.js
│   │   │   ├── vehicle.service.js
│   │   │   ├── vehicle.repository.js
│   │   │   ├── vehicle.factory.js              # vehicle creation factory
│   │   │   └── vehicle.routes.js
│   │   │
│   │   ├── ride/
│   │   │   │
│   │   │   ├── ride.model.js
│   │   │   ├── ride.routes.js
│   │   │   ├── ride.controller.js
│   │   │   ├── ride.service.js                 # core business logic
│   │   │   ├── ride.repository.js
│   │   │   ├── ride.validation.js
│   │   │   ├── ride.mapper.js
│   │   │   ├── ride.constants.js
│   │   │   │
│   │   │   ├── state/
│   │   │   │   ├── ride-state.interface.js
│   │   │   │   ├── ride-state.factory.js
│   │   │   │   │
│   │   │   │   ├── requested.state.js
│   │   │   │   ├── assigned.state.js
│   │   │   │   ├── arriving.state.js
│   │   │   │   ├── otp-verified.state.js
│   │   │   │   ├── in-progress.state.js
│   │   │   │   ├── completed.state.js
│   │   │   │   └── cancelled.state.js
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   ├── driver-matching.strategy.js
│   │   │   │   ├── nearest-driver.strategy.js
│   │   │   │   ├── rating-driver.strategy.js
│   │   │   │   └── driver-strategy.factory.js
│   │   │   │
│   │   │   └── events/
│   │   │       ├── ride-created.event.js
│   │   │       ├── ride-accepted.event.js
│   │   │       ├── ride-started.event.js
│   │   │       └── ride-completed.event.js
│   │   │
│   │   ├── payment/
│   │   │   │
│   │   │   ├── payment.model.js
│   │   │   ├── payment.routes.js
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.service.js
│   │   │   ├── payment.repository.js
│   │   │   ├── payment.constants.js
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   ├── payment.strategy.js
│   │   │   │   ├── cash.strategy.js
│   │   │   │   ├── upi.strategy.js
│   │   │   │   ├── card.strategy.js
│   │   │   │   └── payment-strategy.factory.js
│   │   │   │
│   │   │   └── events/
│   │   │       └── payment-completed.event.js
│   │   │
│   │   ├── notification/
│   │   │   ├── notification.service.js
│   │   │   ├── notification.socket.js
│   │   │   └── notification.events.js
│   │   │
│   │   ├── otp/
│   │   │   ├── otp.service.js
│   │   │   ├── otp.repository.js
│   │   │   └── otp.validation.js
│   │   │
│   │   └── admin/
│   │       ├── admin.routes.js
│   │       ├── admin.controller.js
│   │       ├── admin.service.js
│   │       ├── admin.repository.js
│   │       └── admin.validation.js
│   │
│   │
│   ├── routes/
│   │   └── index.js                             # combine all module routes
│   │
│   └── docs/
│       └── swagger.json
│
├── package.json
├── .env
├── .gitignore
└── README.md
```

> **Prompt** Good now come to the frontend so you created so many screens for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  
```text id="cxr53d"
frontend/
│
├── src/
│   │
│   ├── main.jsx                                 # react bootstrap
│   ├── App.jsx                                  # root app component
│   │
│   ├── app/
│   │   ├── router.jsx                           # app routes
│   │   ├── store.js                             # redux/zustand store
│   │   ├── socket.js                            # singleton socket connection
│   │   └── providers.jsx                        # app providers
│   │
│   ├── core/
│   │   │
│   │   ├── api/
│   │   │   ├── axios.client.js                  # axios singleton
│   │   │   ├── api.endpoints.js
│   │   │   └── api.interceptor.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useDebounce.js
│   │   │   └── useGeoLocation.js
│   │   │
│   │   ├── services/
│   │   │   ├── socket.service.js
│   │   │   ├── location.service.js
│   │   │   ├── notification.service.js
│   │   │   └── storage.service.js
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.constants.js
│   │   │   ├── ride.constants.js
│   │   │   └── payment.constants.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── guards/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RiderRoute.jsx
│   │   │   ├── DriverRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── RiderLayout.jsx
│   │   │   ├── DriverLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── map/
│   │   │   │   ├── RiderMap.jsx
│   │   │   │   ├── DriverMap.jsx
│   │   │   │   ├── LiveTrackingMap.jsx
│   │   │   │   └── RouteMap.jsx
│   │   │   │
│   │   │   ├── socket/
│   │   │   │   ├── SocketListener.jsx
│   │   │   │   └── RealtimeTracker.jsx
│   │   │   │
│   │   │   ├── ride/
│   │   │   │   ├── RideCard.jsx
│   │   │   │   ├── RideStatusBadge.jsx
│   │   │   │   ├── RideFareCard.jsx
│   │   │   │   └── RideOtpModal.jsx
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── PaymentMethodCard.jsx
│   │   │   │   ├── PaymentSummary.jsx
│   │   │   │   └── PaymentSuccessModal.jsx
│   │   │   │
│   │   │   └── tables/
│   │   │       ├── RidersTable.jsx
│   │   │       ├── DriversTable.jsx
│   │   │       └── RidesTable.jsx
│   │   │
│   │   └── utils/
│   │       ├── formatCurrency.js
│   │       ├── formatDate.js
│   │       ├── calculateDistance.js
│   │       └── toast.util.js
│   │
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx                # LoginPage()
│   │   │   │   └── RegisterPage.jsx             # RegisterPage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.api.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useAuthForm.js
│   │   │   │
│   │   │   └── components/
│   │   │       ├── LoginForm.jsx
│   │   │       └── RegisterForm.jsx
│   │   │
│   │   │
│   │   ├── rider/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── RiderHomePage.jsx            # RiderHomePage()
│   │   │   │   ├── FindDriverPage.jsx           # FindDriverPage()
│   │   │   │   ├── SearchingDriverPage.jsx      # SearchingDriverPage()
│   │   │   │   ├── DriverAcceptedPage.jsx       # DriverAcceptedPage()
│   │   │   │   ├── LiveTrackingPage.jsx         # LiveTrackingPage()
│   │   │   │   ├── OtpVerificationPage.jsx      # OtpVerificationPage()
│   │   │   │   ├── RideInProgressPage.jsx       # RideInProgressPage()
│   │   │   │   ├── RideCompletedPage.jsx        # RideCompletedPage()
│   │   │   │   ├── PaymentPage.jsx              # PaymentPage()
│   │   │   │   ├── RideHistoryPage.jsx          # RideHistoryPage()
│   │   │   │   └── RideDetailsPage.jsx          # RideDetailsPage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── rider.api.js
│   │   │   │   ├── ride.api.js
│   │   │   │   └── tracking.api.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useRideBooking.js
│   │   │   │   ├── useRideTracking.js
│   │   │   │   └── useRideHistory.js
│   │   │   │
│   │   │   └── components/
│   │   │       ├── RideSearchForm.jsx
│   │   │       ├── NearbyDriversList.jsx
│   │   │       ├── DriverInfoCard.jsx
│   │   │       ├── RideTrackingCard.jsx
│   │   │       └── RiderRideHistoryList.jsx
│   │   │
│   │   │
│   │   ├── driver/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── DriverDashboardPage.jsx      # DriverDashboardPage()
│   │   │   │   ├── VehicleRegisterPage.jsx      # VehicleRegisterPage()
│   │   │   │   ├── OnlineStatusPage.jsx         # OnlineStatusPage()
│   │   │   │   ├── IncomingRidePage.jsx         # IncomingRidePage()
│   │   │   │   ├── RideAcceptedPage.jsx         # RideAcceptedPage()
│   │   │   │   ├── DriverOtpPage.jsx            # DriverOtpPage()
│   │   │   │   ├── DriverRidePage.jsx           # DriverRidePage()
│   │   │   │   ├── RideSummaryPage.jsx          # RideSummaryPage()
│   │   │   │   ├── EarningsPage.jsx             # EarningsPage()
│   │   │   │   ├── DriverRideHistoryPage.jsx    # DriverRideHistoryPage()
│   │   │   │   └── DriverProfilePage.jsx        # DriverProfilePage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── driver.api.js
│   │   │   │   ├── earnings.api.js
│   │   │   │   └── driver-tracking.api.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useDriverStatus.js
│   │   │   │   ├── useIncomingRides.js
│   │   │   │   └── useDriverTracking.js
│   │   │   │
│   │   │   └── components/
│   │   │       ├── RideRequestCard.jsx
│   │   │       ├── DriverEarningsCard.jsx
│   │   │       ├── DriverStatusToggle.jsx
│   │   │       ├── DriverRideMap.jsx
│   │   │       └── DriverHistoryList.jsx
│   │   │
│   │   │
│   │   ├── admin/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── AdminDashboardPage.jsx       # AdminDashboardPage()
│   │   │   │   ├── RidersManagementPage.jsx     # RidersManagementPage()
│   │   │   │   ├── DriversManagementPage.jsx    # DriversManagementPage()
│   │   │   │   ├── DriverDetailsPage.jsx        # DriverDetailsPage()
│   │   │   │   ├── RideMonitoringPage.jsx       # RideMonitoringPage()
│   │   │   │   ├── RideDetailsPage.jsx          # RideDetailsPage()
│   │   │   │   ├── BlockUserPage.jsx            # BlockUserPage()
│   │   │   │   ├── AnalyticsPage.jsx            # AnalyticsPage()
│   │   │   │   └── AdminProfilePage.jsx         # AdminProfilePage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── admin.api.js
│   │   │   │   ├── analytics.api.js
│   │   │   │   └── monitoring.api.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAnalytics.js
│   │   │   │   ├── useRideMonitoring.js
│   │   │   │   └── useUserManagement.js
│   │   │   │
│   │   │   └── components/
│   │   │       ├── AnalyticsCard.jsx
│   │   │       ├── RideMonitoringList.jsx
│   │   │       ├── UserBlockModal.jsx
│   │   │       └── AdminStatsCard.jsx
│   │   │
│   │   │
│   │   └── notification/
│   │       ├── components/
│   │       │   ├── NotificationToast.jsx
│   │       │   ├── RideAcceptedNotification.jsx
│   │       │   └── PaymentNotification.jsx
│   │       │
│   │       └── hooks/
│   │           └── useNotifications.js
│   │
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── theme.css
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── animations/
│   │
│   └── shared/
│       ├── enums/
│       │   ├── role.enum.js
│       │   ├── ride-status.enum.js
│       │   └── payment-status.enum.js
│       │
│       ├── dto/
│       │   ├── ride.dto.js
│       │   ├── payment.dto.js
│       │   └── user.dto.js
│       │
│       └── mapper/
│           ├── ride.mapper.js
│           └── user.mapper.js
│
├── public/
│
├── package.json
├── vite.config.js
├── .env
└── README.md
```





