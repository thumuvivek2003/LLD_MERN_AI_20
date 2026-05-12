> **Prompt** single file within only a tree structure with file names and function names with , for the backend for MERN (node , mongo db ) using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory , Repository , Observer , Repo , service , singleton where it needs so give me backend tree structure

```text
backend/
│
├── src/
│   │
│   ├── app.js
│   │   └── createExpressApp()
│   │
│   ├── server.js
│   │   └── startServer()
│   │
│   ├── config/
│   │   │
│   │   ├── env.config.js
│   │   │   └── loadEnvConfig()
│   │   │
│   │   ├── db.config.js
│   │   │   ├── connectDatabase()
│   │   │   └── getDatabaseInstance()                // Singleton
│   │   │
│   │   └── logger.config.js
│   │       └── createLogger()                       // Singleton
│   │
│   ├── core/
│   │   │
│   │   ├── constants/
│   │   │   │
│   │   │   ├── roles.constants.js
│   │   │   │   └── USER_ROLES
│   │   │   │
│   │   │   ├── order-status.constants.js
│   │   │   │   └── ORDER_STATUS
│   │   │   │
│   │   │   ├── payment.constants.js
│   │   │   │   └── PAYMENT_METHODS
│   │   │   │
│   │   │   └── delivery.constants.js
│   │   │       └── DELIVERY_ASSIGNMENT_TYPES
│   │   │
│   │   ├── errors/
│   │   │   │
│   │   │   ├── app.error.js
│   │   │   │   └── AppError
│   │   │   │
│   │   │   ├── bad-request.error.js
│   │   │   │   └── BadRequestError
│   │   │   │
│   │   │   ├── unauthorized.error.js
│   │   │   │   └── UnauthorizedError
│   │   │   │
│   │   │   └── not-found.error.js
│   │   │       └── NotFoundError
│   │   │
│   │   ├── middlewares/
│   │   │   │
│   │   │   ├── auth.middleware.js
│   │   │   │   └── authenticateUser()
│   │   │   │
│   │   │   ├── role.middleware.js
│   │   │   │   └── authorizeRoles()
│   │   │   │
│   │   │   ├── error.middleware.js
│   │   │   │   └── globalErrorHandler()
│   │   │   │
│   │   │   └── validate.middleware.js
│   │   │       └── validateRequest()
│   │   │
│   │   ├── utils/
│   │   │   │
│   │   │   ├── jwt.util.js
│   │   │   │   ├── generateAccessToken()
│   │   │   │   └── verifyAccessToken()
│   │   │   │
│   │   │   ├── bcrypt.util.js
│   │   │   │   ├── hashPassword()
│   │   │   │   └── comparePassword()
│   │   │   │
│   │   │   ├── otp.util.js
│   │   │   │   └── generateOtp()
│   │   │   │
│   │   │   ├── geo.util.js
│   │   │   │   └── calculateDistance()
│   │   │   │
│   │   │   └── response.util.js
│   │   │       ├── successResponse()
│   │   │       └── errorResponse()
│   │   │
│   │   └── base/
│   │       │
│   │       ├── base.repository.js
│   │       │   ├── create()
│   │       │   ├── findById()
│   │       │   ├── findOne()
│   │       │   ├── findAll()
│   │       │   ├── updateById()
│   │       │   └── deleteById()
│   │       │
│   │       └── base.service.js
│   │           └── execute()
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   │
│   │   │   ├── auth.routes.js
│   │   │   │   └── registerAuthRoutes()
│   │   │   │
│   │   │   ├── auth.controller.js
│   │   │   │   ├── register()
│   │   │   │   └── login()
│   │   │   │
│   │   │   ├── auth.service.js
│   │   │   │   ├── registerUser()
│   │   │   │   └── loginUser()
│   │   │   │
│   │   │   ├── auth.validator.js
│   │   │   │   ├── registerValidation()
│   │   │   │   └── loginValidation()
│   │   │   │
│   │   │   └── auth.dto.js
│   │   │       └── buildAuthResponseDto()
│   │   │
│   │   ├── users/
│   │   │   │
│   │   │   ├── user.routes.js
│   │   │   │   └── registerUserRoutes()
│   │   │   │
│   │   │   ├── user.controller.js
│   │   │   │   ├── getUsers()
│   │   │   │   ├── updateUserRole()
│   │   │   │   └── blockUser()
│   │   │   │
│   │   │   ├── user.service.js
│   │   │   │   ├── getAllUsers()
│   │   │   │   ├── changeUserRole()
│   │   │   │   └── toggleBlockUser()
│   │   │   │
│   │   │   ├── user.repository.js
│   │   │   │   ├── findUserByEmail()
│   │   │   │   └── updateUserRole()
│   │   │   │
│   │   │   ├── user.model.js
│   │   │   │   └── UserSchema
│   │   │   │
│   │   │   ├── user.mapper.js
│   │   │   │   └── toUserDto()
│   │   │   │
│   │   │   └── user.dto.js
│   │   │       └── buildUserDto()
│   │   │
│   │   ├── restaurants/
│   │   │   │
│   │   │   ├── restaurant.routes.js
│   │   │   │   └── registerRestaurantRoutes()
│   │   │   │
│   │   │   ├── restaurant.controller.js
│   │   │   │   ├── createRestaurant()
│   │   │   │   ├── updateRestaurant()
│   │   │   │   ├── getRestaurants()
│   │   │   │   └── assignRestaurantAdmin()
│   │   │   │
│   │   │   ├── restaurant.service.js
│   │   │   │   ├── createRestaurant()
│   │   │   │   ├── updateRestaurant()
│   │   │   │   ├── getNearbyRestaurants()
│   │   │   │   └── assignAdminToRestaurant()
│   │   │   │
│   │   │   ├── restaurant.repository.js
│   │   │   │   ├── findNearbyRestaurants()
│   │   │   │   └── assignAdmin()
│   │   │   │
│   │   │   ├── restaurant.model.js
│   │   │   │   └── RestaurantSchema
│   │   │   │
│   │   │   ├── restaurant.mapper.js
│   │   │   │   └── toRestaurantDto()
│   │   │   │
│   │   │   └── restaurant.dto.js
│   │   │       └── buildRestaurantDto()
│   │   │
│   │   ├── menu-items/
│   │   │   │
│   │   │   ├── menu-item.routes.js
│   │   │   │   └── registerMenuItemRoutes()
│   │   │   │
│   │   │   ├── menu-item.controller.js
│   │   │   │   ├── createMenuItem()
│   │   │   │   ├── updateMenuItem()
│   │   │   │   └── getRestaurantMenu()
│   │   │   │
│   │   │   ├── menu-item.service.js
│   │   │   │   ├── createMenuItem()
│   │   │   │   ├── updateMenuItem()
│   │   │   │   └── toggleAvailability()
│   │   │   │
│   │   │   ├── menu-item.repository.js
│   │   │   │   └── findMenuByRestaurantId()
│   │   │   │
│   │   │   ├── menu-item.model.js
│   │   │   │   └── MenuItemSchema
│   │   │   │
│   │   │   ├── menu-item.mapper.js
│   │   │   │   └── toMenuItemDto()
│   │   │   │
│   │   │   └── menu-item.dto.js
│   │   │       └── buildMenuItemDto()
│   │   │
│   │   ├── carts/
│   │   │   │
│   │   │   ├── cart.routes.js
│   │   │   │   └── registerCartRoutes()
│   │   │   │
│   │   │   ├── cart.controller.js
│   │   │   │   ├── addItemToCart()
│   │   │   │   ├── removeItemFromCart()
│   │   │   │   └── getCart()
│   │   │   │
│   │   │   ├── cart.service.js
│   │   │   │   ├── addCartItem()
│   │   │   │   ├── removeCartItem()
│   │   │   │   └── calculateCartTotal()
│   │   │   │
│   │   │   ├── cart.repository.js
│   │   │   │   └── findCartByUserId()
│   │   │   │
│   │   │   ├── cart.model.js
│   │   │   │   └── CartSchema
│   │   │   │
│   │   │   └── cart.mapper.js
│   │   │       └── toCartDto()
│   │   │
│   │   ├── orders/
│   │   │   │
│   │   │   ├── order.routes.js
│   │   │   │   └── registerOrderRoutes()
│   │   │   │
│   │   │   ├── order.controller.js
│   │   │   │   ├── placeOrder()
│   │   │   │   ├── getOrderDetails()
│   │   │   │   ├── updateOrderStatus()
│   │   │   │   └── getOrderHistory()
│   │   │   │
│   │   │   ├── order.service.js
│   │   │   │   ├── createOrder()
│   │   │   │   ├── processOrder()
│   │   │   │   ├── assignDeliveryPartner()
│   │   │   │   └── transitionOrderState()
│   │   │   │
│   │   │   ├── order.repository.js
│   │   │   │   ├── findOrdersByUser()
│   │   │   │   └── updateOrderStatus()
│   │   │   │
│   │   │   ├── order.model.js
│   │   │   │   └── OrderSchema
│   │   │   │
│   │   │   ├── order.mapper.js
│   │   │   │   └── toOrderDto()
│   │   │   │
│   │   │   ├── order.dto.js
│   │   │   │   └── buildOrderDto()
│   │   │   │
│   │   │   ├── states/                               // State Pattern
│   │   │   │   │
│   │   │   │   ├── order-state.interface.js
│   │   │   │   │   └── OrderState
│   │   │   │   │
│   │   │   │   ├── created.state.js
│   │   │   │   │   └── handle()
│   │   │   │   │
│   │   │   │   ├── paid.state.js
│   │   │   │   │   └── handle()
│   │   │   │   │
│   │   │   │   ├── preparing.state.js
│   │   │   │   │   └── handle()
│   │   │   │   │
│   │   │   │   ├── out-for-delivery.state.js
│   │   │   │   │   └── handle()
│   │   │   │   │
│   │   │   │   ├── delivered.state.js
│   │   │   │   │   └── handle()
│   │   │   │   │
│   │   │   │   └── cancelled.state.js
│   │   │   │       └── handle()
│   │   │   │
│   │   │   └── factories/
│   │   │       └── order-state.factory.js
│   │   │           └── getOrderStateHandler()
│   │   │
│   │   ├── payments/
│   │   │   │
│   │   │   ├── payment.service.js
│   │   │   │   └── processPayment()
│   │   │   │
│   │   │   ├── payment.model.js
│   │   │   │   └── PaymentSchema
│   │   │   │
│   │   │   ├── strategies/                          // Strategy Pattern
│   │   │   │   │
│   │   │   │   ├── payment-strategy.interface.js
│   │   │   │   │   └── pay()
│   │   │   │   │
│   │   │   │   ├── upi.strategy.js
│   │   │   │   │   └── pay()
│   │   │   │   │
│   │   │   │   ├── card.strategy.js
│   │   │   │   │   └── pay()
│   │   │   │   │
│   │   │   │   └── cod.strategy.js
│   │   │   │       └── pay()
│   │   │   │
│   │   │   └── factories/
│   │   │       └── payment-strategy.factory.js
│   │   │           └── getPaymentStrategy()
│   │   │
│   │   ├── delivery/
│   │   │   │
│   │   │   ├── delivery.controller.js
│   │   │   │   ├── acceptDelivery()
│   │   │   │   ├── rejectDelivery()
│   │   │   │   ├── markPickedUp()
│   │   │   │   └── markDelivered()
│   │   │   │
│   │   │   ├── delivery.service.js
│   │   │   │   ├── assignPartner()
│   │   │   │   ├── verifyDeliveryOtp()
│   │   │   │   └── completeDelivery()
│   │   │   │
│   │   │   ├── delivery.repository.js
│   │   │   │   └── findAvailablePartners()
│   │   │   │
│   │   │   ├── delivery.model.js
│   │   │   │   └── DeliveryPartnerSchema
│   │   │   │
│   │   │   ├── strategies/                          // Strategy Pattern
│   │   │   │   │
│   │   │   │   ├── assignment-strategy.interface.js
│   │   │   │   │   └── assign()
│   │   │   │   │
│   │   │   │   ├── nearest-partner.strategy.js
│   │   │   │   │   └── assign()
│   │   │   │   │
│   │   │   │   └── best-rated.strategy.js
│   │   │   │       └── assign()
│   │   │   │
│   │   │   └── factories/
│   │   │       └── delivery-strategy.factory.js
│   │   │           └── getAssignmentStrategy()
│   │   │
│   │   └── notifications/
│   │       │
│   │       ├── notification.service.js
│   │       │   ├── sendOtpNotification()
│   │       │   └── sendOrderNotification()
│   │       │
│   │       ├── observers/                           // Observer Pattern
│   │       │   │
│   │       │   ├── order-created.observer.js
│   │       │   │   └── notify()
│   │       │   │
│   │       │   ├── order-delivered.observer.js
│   │       │   │   └── notify()
│   │       │   │
│   │       │   └── payment-success.observer.js
│   │       │       └── notify()
│   │       │
│   │       └── event-bus.js
│   │           ├── subscribe()
│   │           └── publish()
│   │
│   └── routes/
│       └── index.js
│           └── registerAllRoutes()
│
├── .env
├── package.json
└── README.md
```



> **Prompt** Good now come to the frontend so you created so many screens for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure 

```text id="8km9vz"
frontend/
│
├── public/
│   └── vite.svg
│
├── src/
│   │
│   ├── main.jsx
│   │   └── bootstrapApplication()
│   │
│   ├── App.jsx
│   │   └── App()
│   │
│   ├── router/
│   │   ├── index.jsx
│   │   │   └── AppRouter()
│   │   │
│   │   ├── ProtectedRoute.jsx
│   │   │   └── ProtectedRoute()
│   │   │
│   │   └── RoleBasedRoute.jsx
│   │       └── RoleBasedRoute()
│   │
│   ├── layouts/
│   │   │
│   │   ├── CustomerLayout.jsx
│   │   │   └── CustomerLayout()
│   │   │
│   │   ├── RestaurantAdminLayout.jsx
│   │   │   └── RestaurantAdminLayout()
│   │   │
│   │   ├── DeliveryPartnerLayout.jsx
│   │   │   └── DeliveryPartnerLayout()
│   │   │
│   │   └── MainAdminLayout.jsx
│   │       └── MainAdminLayout()
│   │
│   ├── core/
│   │   │
│   │   ├── constants/
│   │   │   │
│   │   │   ├── roles.constants.js
│   │   │   │   └── USER_ROLES
│   │   │   │
│   │   │   ├── order-status.constants.js
│   │   │   │   └── ORDER_STATUS
│   │   │   │
│   │   │   └── payment.constants.js
│   │   │       └── PAYMENT_METHODS
│   │   │
│   │   ├── hooks/
│   │   │   │
│   │   │   ├── useAuth.js
│   │   │   │   └── useAuth()
│   │   │   │
│   │   │   ├── useApi.js
│   │   │   │   └── useApi()
│   │   │   │
│   │   │   ├── useModal.js
│   │   │   │   └── useModal()
│   │   │   │
│   │   │   └── useDebounce.js
│   │   │       └── useDebounce()
│   │   │
│   │   ├── services/
│   │   │   │
│   │   │   ├── api.service.js
│   │   │   │   ├── getRequest()
│   │   │   │   ├── postRequest()
│   │   │   │   ├── putRequest()
│   │   │   │   └── deleteRequest()
│   │   │   │
│   │   │   ├── token.service.js
│   │   │   │   ├── setAccessToken()
│   │   │   │   ├── getAccessToken()
│   │   │   │   └── clearAccessToken()
│   │   │   │
│   │   │   └── notification.service.js
│   │   │       ├── showSuccessToast()
│   │   │       └── showErrorToast()
│   │   │
│   │   ├── utils/
│   │   │   │
│   │   │   ├── currency.util.js
│   │   │   │   └── formatCurrency()
│   │   │   │
│   │   │   ├── distance.util.js
│   │   │   │   └── calculateDistanceLabel()
│   │   │   │
│   │   │   ├── date.util.js
│   │   │   │   └── formatDate()
│   │   │   │
│   │   │   └── validation.util.js
│   │   │       ├── validateEmail()
│   │   │       └── validatePassword()
│   │   │
│   │   ├── context/
│   │   │   │
│   │   │   ├── AuthContext.jsx
│   │   │   │   ├── AuthProvider()
│   │   │   │   └── useAuthContext()
│   │   │   │
│   │   │   ├── CartContext.jsx
│   │   │   │   ├── CartProvider()
│   │   │   │   └── useCartContext()
│   │   │   │
│   │   │   └── OrderContext.jsx
│   │   │       ├── OrderProvider()
│   │   │       └── useOrderContext()
│   │   │
│   │   └── styles/
│   │       ├── globals.css
│   │       └── theme.css
│   │
│   ├── shared/
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   │
│   │   │   │   ├── Button.jsx
│   │   │   │   │   └── Button()
│   │   │   │   │
│   │   │   │   ├── Input.jsx
│   │   │   │   │   └── Input()
│   │   │   │   │
│   │   │   │   ├── Modal.jsx
│   │   │   │   │   └── Modal()
│   │   │   │   │
│   │   │   │   ├── Loader.jsx
│   │   │   │   │   └── Loader()
│   │   │   │   │
│   │   │   │   ├── Table.jsx
│   │   │   │   │   └── Table()
│   │   │   │   │
│   │   │   │   ├── Badge.jsx
│   │   │   │   │   └── Badge()
│   │   │   │   │
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   │   └── EmptyState()
│   │   │   │   │
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   │       └── ConfirmDialog()
│   │   │   │
│   │   │   ├── cards/
│   │   │   │   │
│   │   │   │   ├── RestaurantCard.jsx
│   │   │   │   │   └── RestaurantCard()
│   │   │   │   │
│   │   │   │   ├── MenuItemCard.jsx
│   │   │   │   │   └── MenuItemCard()
│   │   │   │   │
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   └── OrderCard()
│   │   │   │   │
│   │   │   │   └── DeliveryCard.jsx
│   │   │   │       └── DeliveryCard()
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   │
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   └── LoginForm()
│   │   │   │   │
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   └── RegisterForm()
│   │   │   │   │
│   │   │   │   ├── RestaurantForm.jsx
│   │   │   │   │   └── RestaurantForm()
│   │   │   │   │
│   │   │   │   ├── MenuItemForm.jsx
│   │   │   │   │   └── MenuItemForm()
│   │   │   │   │
│   │   │   │   └── PaymentForm.jsx
│   │   │   │       └── PaymentForm()
│   │   │   │
│   │   │   └── navigation/
│   │   │       │
│   │   │       ├── Sidebar.jsx
│   │   │       │   └── Sidebar()
│   │   │       │
│   │   │       ├── Navbar.jsx
│   │   │       │   └── Navbar()
│   │   │       │
│   │   │       └── BottomTab.jsx
│   │   │           └── BottomTab()
│   │   │
│   │   └── pages/
│   │       ├── NotFoundPage.jsx
│   │       │   └── NotFoundPage()
│   │       │
│   │       └── UnauthorizedPage.jsx
│   │           └── UnauthorizedPage()
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
│   │   │   ├── services/
│   │   │   │   └── auth.api.js
│   │   │   │       ├── loginUser()
│   │   │   │       └── registerUser()
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── useLogin.js
│   │   │           └── useLogin()
│   │   │
│   │   ├── customer/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   │
│   │   │   │   ├── HomePage.jsx
│   │   │   │   │   └── HomePage()
│   │   │   │   │
│   │   │   │   ├── RestaurantDetailsPage.jsx
│   │   │   │   │   └── RestaurantDetailsPage()
│   │   │   │   │
│   │   │   │   ├── MenuItemDetailsPage.jsx
│   │   │   │   │   └── MenuItemDetailsPage()
│   │   │   │   │
│   │   │   │   ├── CartPage.jsx
│   │   │   │   │   └── CartPage()
│   │   │   │   │
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   │   └── CheckoutPage()
│   │   │   │   │
│   │   │   │   ├── OrderTrackingPage.jsx
│   │   │   │   │   └── OrderTrackingPage()
│   │   │   │   │
│   │   │   │   ├── OrderHistoryPage.jsx
│   │   │   │   │   └── OrderHistoryPage()
│   │   │   │   │
│   │   │   │   └── OtpVerificationPage.jsx
│   │   │   │       └── OtpVerificationPage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   │
│   │   │   │   ├── customer.api.js
│   │   │   │   │   ├── getRestaurants()
│   │   │   │   │   ├── getRestaurantDetails()
│   │   │   │   │   └── placeOrder()
│   │   │   │   │
│   │   │   │   └── cart.service.js
│   │   │   │       ├── addToCart()
│   │   │   │       ├── removeFromCart()
│   │   │   │       └── getCartTotal()
│   │   │   │
│   │   │   └── hooks/
│   │   │       ├── useCart.js
│   │   │       │   └── useCart()
│   │   │       │
│   │   │       └── useOrders.js
│   │   │           └── useOrders()
│   │   │
│   │   ├── restaurant-admin/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   │
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   │   └── DashboardPage()
│   │   │   │   │
│   │   │   │   ├── MenuManagementPage.jsx
│   │   │   │   │   └── MenuManagementPage()
│   │   │   │   │
│   │   │   │   ├── AddMenuItemPage.jsx
│   │   │   │   │   └── AddMenuItemPage()
│   │   │   │   │
│   │   │   │   ├── EditMenuItemPage.jsx
│   │   │   │   │   └── EditMenuItemPage()
│   │   │   │   │
│   │   │   │   ├── IncomingOrdersPage.jsx
│   │   │   │   │   └── IncomingOrdersPage()
│   │   │   │   │
│   │   │   │   ├── OrderDetailsPage.jsx
│   │   │   │   │   └── OrderDetailsPage()
│   │   │   │   │
│   │   │   │   ├── AssignDeliveryPage.jsx
│   │   │   │   │   └── AssignDeliveryPage()
│   │   │   │   │
│   │   │   │   ├── OrderStatusPage.jsx
│   │   │   │   │   └── OrderStatusPage()
│   │   │   │   │
│   │   │   │   └── RestaurantProfilePage.jsx
│   │   │   │       └── RestaurantProfilePage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── restaurant-admin.api.js
│   │   │   │       ├── getIncomingOrders()
│   │   │   │       ├── createMenuItem()
│   │   │   │       ├── updateOrderStatus()
│   │   │   │       └── assignDeliveryPartner()
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── useRestaurantOrders.js
│   │   │           └── useRestaurantOrders()
│   │   │
│   │   ├── delivery-partner/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   │
│   │   │   │   ├── DeliveryDashboardPage.jsx
│   │   │   │   │   └── DeliveryDashboardPage()
│   │   │   │   │
│   │   │   │   ├── AvailableOrdersPage.jsx
│   │   │   │   │   └── AvailableOrdersPage()
│   │   │   │   │
│   │   │   │   ├── OngoingDeliveryPage.jsx
│   │   │   │   │   └── OngoingDeliveryPage()
│   │   │   │   │
│   │   │   │   ├── PickupVerificationPage.jsx
│   │   │   │   │   └── PickupVerificationPage()
│   │   │   │   │
│   │   │   │   ├── DeliveryOtpPage.jsx
│   │   │   │   │   └── DeliveryOtpPage()
│   │   │   │   │
│   │   │   │   ├── DeliveryHistoryPage.jsx
│   │   │   │   │   └── DeliveryHistoryPage()
│   │   │   │   │
│   │   │   │   ├── EarningsPage.jsx
│   │   │   │   │   └── EarningsPage()
│   │   │   │   │
│   │   │   │   └── DeliveryProfilePage.jsx
│   │   │   │       └── DeliveryProfilePage()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── delivery.api.js
│   │   │   │       ├── acceptDelivery()
│   │   │   │       ├── rejectDelivery()
│   │   │   │       ├── completeDelivery()
│   │   │   │       └── verifyDeliveryOtp()
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── useDeliveryOrders.js
│   │   │           └── useDeliveryOrders()
│   │   │
│   │   └── main-admin/
│   │       │
│   │       ├── pages/
│   │       │   │
│   │       │   ├── AdminDashboardPage.jsx
│   │       │   │   └── AdminDashboardPage()
│   │       │   │
│   │       │   ├── UsersManagementPage.jsx
│   │       │   │   └── UsersManagementPage()
│   │       │   │
│   │       │   ├── RestaurantsManagementPage.jsx
│   │       │   │   └── RestaurantsManagementPage()
│   │       │   │
│   │       │   ├── AddRestaurantPage.jsx
│   │       │   │   └── AddRestaurantPage()
│   │       │   │
│   │       │   ├── EditRestaurantPage.jsx
│   │       │   │   └── EditRestaurantPage()
│   │       │   │
│   │       │   ├── RestaurantMappingPage.jsx
│   │       │   │   └── RestaurantMappingPage()
│   │       │
│   │       ├── services/
│   │       │   └── admin.api.js
│   │       │       ├── getUsers()
│   │       │       ├── createRestaurant()
│   │       │       ├── assignRestaurantAdmin()
│   │       │       └── blockUser()
│   │       │
│   │       └── hooks/
│   │           └── useAdminDashboard.js
│   │               └── useAdminDashboard()
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── animations/
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```
