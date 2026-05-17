> **Prompt** good now single  file within only a tree structure with file names and function names with , for the backend for MERN  (node , mongo db ) esm  using best SOLID principles and module based architecture - don't over complicate , keep minimal but best standards as you said maintain Strategy , State , Factory  ,  Repo , service , singleton if required and other required   where it needs so give me backend tree structure to simulate  above and show

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
│   │   │
│   │   ├── env.config.js
│   │   │   └── loadEnv()
│   │   │
│   │   ├── db.config.js
│   │   │   └── connectDB()
│   │   │
│   │   └── app.config.js
│   │       └── getAppConfig()
│   │
│   ├── common/
│   │   │
│   │   ├── constants/
│   │   │   ├── orderStatus.constants.js
│   │   │   ├── paymentType.constants.js
│   │   │   └── couponType.constants.js
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.js
│   │   │   ├── ValidationError.js
│   │   │   ├── NotFoundError.js
│   │   │   └── UnauthorizedError.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   │   └── verifyAuth()
│   │   │   │
│   │   │   ├── error.middleware.js
│   │   │   │   └── globalErrorHandler()
│   │   │   │
│   │   │   └── validate.middleware.js
│   │   │       └── validateRequest()
│   │   │
│   │   ├── utils/
│   │   │   ├── response.util.js
│   │   │   │   ├── successResponse()
│   │   │   │   └── errorResponse()
│   │   │   │
│   │   │   ├── price.util.js
│   │   │   │   └── calculateSubtotal()
│   │   │   │
│   │   │   └── id.util.js
│   │   │       └── generateId()
│   │   │
│   │   └── database/
│   │       └── BaseRepository.js
│   │           ├── create()
│   │           ├── findById()
│   │           ├── findOne()
│   │           ├── update()
│   │           └── delete()
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   │
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   │   ├── login()
│   │   │   │   └── register()
│   │   │   │
│   │   │   ├── auth.service.js
│   │   │   │   ├── loginUser()
│   │   │   │   └── registerUser()
│   │   │   │
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── user/
│   │   │   │
│   │   │   ├── user.model.js
│   │   │   │   └── UserSchema
│   │   │   │
│   │   │   ├── user.repository.js
│   │   │   │   └── class UserRepository
│   │   │   │
│   │   │   ├── user.service.js
│   │   │   │   ├── getUserProfile()
│   │   │   │   ├── blockUser()
│   │   │   │   └── unblockUser()
│   │   │   │
│   │   │   ├── user.controller.js
│   │   │   │   ├── getProfile()
│   │   │   │   ├── block()
│   │   │   │   └── unblock()
│   │   │   │
│   │   │   └── user.routes.js
│   │   │
│   │   ├── product/
│   │   │   │
│   │   │   ├── product.model.js
│   │   │   │   └── ProductSchema
│   │   │   │
│   │   │   ├── product.repository.js
│   │   │   │   └── class ProductRepository
│   │   │   │
│   │   │   ├── product.service.js
│   │   │   │   ├── getProducts()
│   │   │   │   └── getProductById()
│   │   │   │
│   │   │   ├── product.controller.js
│   │   │   │   ├── getAll()
│   │   │   │   └── getById()
│   │   │   │
│   │   │   └── product.routes.js
│   │   │
│   │   ├── cart/
│   │   │   │
│   │   │   ├── cart.model.js
│   │   │   │   └── CartSchema
│   │   │   │
│   │   │   ├── cart.repository.js
│   │   │   │   └── class CartRepository
│   │   │   │
│   │   │   ├── cart.service.js
│   │   │   │   ├── getCart()
│   │   │   │   ├── addItem()
│   │   │   │   ├── removeItem()
│   │   │   │   ├── updateQuantity()
│   │   │   │   ├── applyCoupon()
│   │   │   │   └── clearCart()
│   │   │   │
│   │   │   ├── cart.controller.js
│   │   │   │   ├── getCart()
│   │   │   │   ├── addItem()
│   │   │   │   ├── removeItem()
│   │   │   │   ├── updateQty()
│   │   │   │   └── applyCoupon()
│   │   │   │
│   │   │   └── cart.routes.js
│   │   │
│   │   ├── coupon/
│   │   │   │
│   │   │   ├── coupon.model.js
│   │   │   │   └── CouponSchema
│   │   │   │
│   │   │   ├── coupon.repository.js
│   │   │   │   └── class CouponRepository
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   │
│   │   │   │   ├── ICouponStrategy.js
│   │   │   │   │   └── apply(cart)
│   │   │   │   │
│   │   │   │   ├── PercentageCouponStrategy.js
│   │   │   │   │   └── apply(cart)
│   │   │   │   │
│   │   │   │   ├── FlatCouponStrategy.js
│   │   │   │   │   └── apply(cart)
│   │   │   │   │
│   │   │   │   └── FreeShippingStrategy.js
│   │   │   │       └── apply(cart)
│   │   │   │
│   │   │   ├── factories/
│   │   │   │   └── CouponStrategyFactory.js
│   │   │   │       └── create(type)
│   │   │   │
│   │   │   ├── coupon.service.js
│   │   │   │   ├── validateCoupon()
│   │   │   │   ├── applyCoupon()
│   │   │   │   ├── createCoupon()
│   │   │   │   └── assignCoupon()
│   │   │   │
│   │   │   ├── coupon.controller.js
│   │   │   │   ├── apply()
│   │   │   │   ├── create()
│   │   │   │   └── assign()
│   │   │   │
│   │   │   └── coupon.routes.js
│   │   │
│   │   ├── pricing/
│   │   │   │
│   │   │   ├── PricingService.js
│   │   │   │   └── calculate(cart)
│   │   │   │
│   │   │   ├── pipeline/
│   │   │   │   │
│   │   │   │   ├── PricingPipeline.js
│   │   │   │   │   └── execute(context)
│   │   │   │   │
│   │   │   │   ├── BasePriceStep.js
│   │   │   │   │   └── process(context)
│   │   │   │   │
│   │   │   │   ├── CouponStep.js
│   │   │   │   │   └── process(context)
│   │   │   │   │
│   │   │   │   ├── DeliveryFeeStep.js
│   │   │   │   │   └── process(context)
│   │   │   │   │
│   │   │   │   └── PlatformFeeStep.js
│   │   │   │       └── process(context)
│   │   │
│   │   ├── inventory/
│   │   │   │
│   │   │   ├── InventoryService.js
│   │   │   │   ├── validateStock()
│   │   │   │   ├── reserveStock()
│   │   │   │   └── releaseStock()
│   │   │   │
│   │   │   └── InventorySingleton.js
│   │   │       └── getInstance()
│   │   │
│   │   ├── payment/
│   │   │   │
│   │   │   ├── strategies/
│   │   │   │   │
│   │   │   │   ├── IPaymentStrategy.js
│   │   │   │   │   └── pay(amount)
│   │   │   │   │
│   │   │   │   ├── UPIPaymentStrategy.js
│   │   │   │   │   └── pay(amount)
│   │   │   │   │
│   │   │   │   ├── CardPaymentStrategy.js
│   │   │   │   │   └── pay(amount)
│   │   │   │   │
│   │   │   │   ├── WalletPaymentStrategy.js
│   │   │   │   │   └── pay(amount)
│   │   │   │   │
│   │   │   │   └── CODPaymentStrategy.js
│   │   │   │       └── pay(amount)
│   │   │   │
│   │   │   ├── factories/
│   │   │   │   └── PaymentStrategyFactory.js
│   │   │   │       └── create(type)
│   │   │   │
│   │   │   ├── payment.service.js
│   │   │   │   └── processPayment()
│   │   │   │
│   │   │   └── PaymentGatewaySingleton.js
│   │   │       └── getInstance()
│   │   │
│   │   ├── order/
│   │   │   │
│   │   │   ├── order.model.js
│   │   │   │   └── OrderSchema
│   │   │   │
│   │   │   ├── order.repository.js
│   │   │   │   └── class OrderRepository
│   │   │   │
│   │   │   ├── builder/
│   │   │   │   └── OrderBuilder.js
│   │   │   │       ├── setUser()
│   │   │   │       ├── setItems()
│   │   │   │       ├── setPayment()
│   │   │   │       ├── setPricing()
│   │   │   │       └── build()
│   │   │   │
│   │   │   ├── states/
│   │   │   │   │
│   │   │   │   ├── IOrderState.js
│   │   │   │   │   ├── confirm()
│   │   │   │   │   ├── ship()
│   │   │   │   │   ├── deliver()
│   │   │   │   │   └── cancel()
│   │   │   │   │
│   │   │   │   ├── CreatedState.js
│   │   │   │   ├── PaidState.js
│   │   │   │   ├── ShippedState.js
│   │   │   │   ├── DeliveredState.js
│   │   │   │   └── CancelledState.js
│   │   │   │
│   │   │   ├── order.service.js
│   │   │   │   ├── createOrder()
│   │   │   │   ├── getOrders()
│   │   │   │   ├── getOrderById()
│   │   │   │   └── updateStatus()
│   │   │   │
│   │   │   ├── order.controller.js
│   │   │   │   ├── create()
│   │   │   │   ├── getAll()
│   │   │   │   ├── getById()
│   │   │   │   └── updateStatus()
│   │   │   │
│   │   │   └── order.routes.js
│   │   │
│   │   ├── checkout/
│   │   │   │
│   │   │   ├── checkout.service.js
│   │   │   │   └── checkout(userId, paymentType)
│   │   │   │
│   │   │   ├── checkout.controller.js
│   │   │   │   └── checkout()
│   │   │   │
│   │   │   └── checkout.routes.js
│   │   │
│   │   └── admin/
│   │       │
│   │       ├── admin.service.js
│   │       │   ├── getAllUsers()
│   │       │   ├── getAllOrders()
│   │       │   └── manageCoupons()
│   │       │
│   │       ├── admin.controller.js
│   │       │   ├── users()
│   │       │   ├── orders()
│   │       │   └── coupons()
│   │       │
│   │       └── admin.routes.js
│   │
│   └── routes/
│       └── index.js
│           └── registerRoutes()
│
├── package.json
├── .env
├── .gitignore
└── README.md
```




> **Prompt** Good now come to the frontend so you created  screens image for the frontend so for that also I want tree structure in the single file covering all the screens of each actor like above give me folder , file name / function name -- don't over complicate , make simple but follow SOLID principles and use design patterns if needed MERN stack i.e REACT give me tree structure  esm 

```text
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
│   ├── routes/
│   │   │
│   │   ├── AppRouter.jsx
│   │   │   └── AppRouter()
│   │   │
│   │   ├── CustomerRoutes.jsx
│   │   │   └── CustomerRoutes()
│   │   │
│   │   ├── AdminRoutes.jsx
│   │   │   └── AdminRoutes()
│   │   │
│   │   └── ProtectedRoute.jsx
│   │       └── ProtectedRoute()
│   │
│   ├── layouts/
│   │   │
│   │   ├── customer/
│   │   │   ├── CustomerLayout.jsx
│   │   │   │   └── CustomerLayout()
│   │   │   │
│   │   │   ├── CustomerNavbar.jsx
│   │   │   │   └── CustomerNavbar()
│   │   │   │
│   │   │   └── CustomerSidebar.jsx
│   │   │       └── CustomerSidebar()
│   │   │
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       │   └── AdminLayout()
│   │       │
│   │       ├── AdminSidebar.jsx
│   │       │   └── AdminSidebar()
│   │       │
│   │       └── AdminHeader.jsx
│   │           └── AdminHeader()
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
│   │   │   ├── services/
│   │   │   │   └── auth.service.js
│   │   │   │       ├── loginUser()
│   │   │   │       └── registerUser()
│   │   │   │
│   │   │   └── store/
│   │   │       └── auth.store.js
│   │   │           ├── setUser()
│   │   │           └── clearUser()
│   │   │
│   │   ├── product/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── ProductListPage.jsx
│   │   │   │   │   └── ProductListPage()
│   │   │   │   │
│   │   │   │   └── ProductDetailsPage.jsx
│   │   │   │       └── ProductDetailsPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   │   └── ProductCard()
│   │   │   │   │
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   │   └── ProductGrid()
│   │   │   │   │
│   │   │   │   └── ProductFilters.jsx
│   │   │   │       └── ProductFilters()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useProducts.js
│   │   │   │       ├── fetchProducts()
│   │   │   │       └── fetchProductById()
│   │   │   │
│   │   │   └── services/
│   │   │       └── product.service.js
│   │   │           ├── getProducts()
│   │   │           └── getProductById()
│   │   │
│   │   ├── cart/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   └── CartPage.jsx
│   │   │   │       └── CartPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   │   └── CartItem()
│   │   │   │   │
│   │   │   │   ├── CartList.jsx
│   │   │   │   │   └── CartList()
│   │   │   │   │
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   │   └── CartSummary()
│   │   │   │   │
│   │   │   │   └── QuantityController.jsx
│   │   │   │       └── QuantityController()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useCart.js
│   │   │   │       ├── addItem()
│   │   │   │       ├── removeItem()
│   │   │   │       ├── updateQuantity()
│   │   │   │       ├── applyCoupon()
│   │   │   │       └── fetchCart()
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── cart.service.js
│   │   │   │       ├── addToCart()
│   │   │   │       ├── removeFromCart()
│   │   │   │       ├── updateQty()
│   │   │   │       └── applyCoupon()
│   │   │   │
│   │   │   └── store/
│   │   │       └── cart.store.js
│   │   │           ├── setCart()
│   │   │           ├── clearCart()
│   │   │           └── updateCart()
│   │   │
│   │   ├── coupon/
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── CouponCard.jsx
│   │   │   │   │   └── CouponCard()
│   │   │   │   │
│   │   │   │   ├── CouponList.jsx
│   │   │   │   │   └── CouponList()
│   │   │   │   │
│   │   │   │   └── CouponInput.jsx
│   │   │   │       └── CouponInput()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useCoupon.js
│   │   │   │       ├── applyCoupon()
│   │   │   │       └── removeCoupon()
│   │   │   │
│   │   │   └── services/
│   │   │       └── coupon.service.js
│   │   │           ├── getCoupons()
│   │   │           └── applyCoupon()
│   │   │
│   │   ├── checkout/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   └── CheckoutPage.jsx
│   │   │   │       └── CheckoutPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── AddressSection.jsx
│   │   │   │   │   └── AddressSection()
│   │   │   │   │
│   │   │   │   ├── PaymentSelector.jsx
│   │   │   │   │   └── PaymentSelector()
│   │   │   │   │
│   │   │   │   ├── PriceBreakdown.jsx
│   │   │   │   │   └── PriceBreakdown()
│   │   │   │   │
│   │   │   │   └── CheckoutSummary.jsx
│   │   │   │       └── CheckoutSummary()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useCheckout.js
│   │   │   │       └── placeOrder()
│   │   │   │
│   │   │   └── services/
│   │   │       └── checkout.service.js
│   │   │           └── checkout()
│   │   │
│   │   ├── payment/
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── PaymentMethodCard.jsx
│   │   │   │   │   └── PaymentMethodCard()
│   │   │   │   │
│   │   │   │   ├── UPIPaymentForm.jsx
│   │   │   │   │   └── UPIPaymentForm()
│   │   │   │   │
│   │   │   │   ├── CardPaymentForm.jsx
│   │   │   │   │   └── CardPaymentForm()
│   │   │   │   │
│   │   │   │   └── WalletPaymentForm.jsx
│   │   │   │       └── WalletPaymentForm()
│   │   │   │
│   │   │   ├── factory/
│   │   │   │   └── PaymentComponentFactory.js
│   │   │   │       └── create(type)
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── usePayment.js
│   │   │           └── processPayment()
│   │   │
│   │   ├── order/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   └── OrdersPage()
│   │   │   │   │
│   │   │   │   └── OrderDetailsPage.jsx
│   │   │   │       └── OrderDetailsPage()
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   └── OrderCard()
│   │   │   │   │
│   │   │   │   ├── OrderTimeline.jsx
│   │   │   │   │   └── OrderTimeline()
│   │   │   │   │
│   │   │   │   ├── OrderItemList.jsx
│   │   │   │   │   └── OrderItemList()
│   │   │   │   │
│   │   │   │   └── OrderStatusBadge.jsx
│   │   │   │       └── OrderStatusBadge()
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useOrders.js
│   │   │   │       ├── fetchOrders()
│   │   │   │       └── fetchOrderDetails()
│   │   │   │
│   │   │   └── services/
│   │   │       └── order.service.js
│   │   │           ├── getOrders()
│   │   │           └── getOrderDetails()
│   │   │
│   │   └── admin/
│   │       │
│   │       ├── dashboard/
│   │       │   ├── pages/
│   │       │   │   └── DashboardPage.jsx
│   │       │   │       └── DashboardPage()
│   │       │   │
│   │       │   └── components/
│   │       │       ├── DashboardCard.jsx
│   │       │       │   └── DashboardCard()
│   │       │       │
│   │       │       └── StatsGrid.jsx
│   │       │           └── StatsGrid()
│   │       │
│   │       ├── users/
│   │       │   │
│   │       │   ├── pages/
│   │       │   │   └── UsersPage.jsx
│   │       │   │       └── UsersPage()
│   │       │   │
│   │       │   ├── components/
│   │       │   │   ├── UserTable.jsx
│   │       │   │   │   └── UserTable()
│   │       │   │   │
│   │       │   │   └── UserStatusToggle.jsx
│   │       │   │       └── UserStatusToggle()
│   │       │   │
│   │       │   └── services/
│   │       │       └── adminUsers.service.js
│   │       │           ├── getUsers()
│   │       │           ├── blockUser()
│   │       │           └── unblockUser()
│   │       │
│   │       ├── coupons/
│   │       │   │
│   │       │   ├── pages/
│   │       │   │   ├── CouponsPage.jsx
│   │       │   │   │   └── CouponsPage()
│   │       │   │   │
│   │       │   │   └── CreateCouponPage.jsx
│   │       │   │       └── CreateCouponPage()
│   │       │   │
│   │       │   ├── components/
│   │       │   │   ├── CouponTable.jsx
│   │       │   │   │   └── CouponTable()
│   │       │   │   │
│   │       │   │   ├── CouponForm.jsx
│   │       │   │   │   └── CouponForm()
│   │       │   │   │
│   │       │   │   └── CouponStatusToggle.jsx
│   │       │   │       └── CouponStatusToggle()
│   │       │   │
│   │       │   └── services/
│   │       │       └── adminCoupon.service.js
│   │       │           ├── createCoupon()
│   │       │           ├── assignCoupon()
│   │       │           └── toggleCoupon()
│   │       │
│   │       └── orders/
│   │           │
│   │           ├── pages/
│   │           │   └── AdminOrdersPage.jsx
│   │           │       └── AdminOrdersPage()
│   │           │
│   │           ├── components/
│   │           │   ├── OrdersTable.jsx
│   │           │   │   └── OrdersTable()
│   │           │   │
│   │           │   └── OrderStatusDropdown.jsx
│   │           │       └── OrderStatusDropdown()
│   │           │
│   │           └── services/
│   │               └── adminOrders.service.js
│   │                   ├── getOrders()
│   │                   └── updateOrderStatus()
│   │
│   ├── shared/
│   │   │
│   │   ├── components/
│   │   │   │
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
│   │   │   └── PageHeader.jsx
│   │   │       └── PageHeader()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── useModal.js
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   │   └── createApiClient()
│   │   │   │
│   │   │   └── token.service.js
│   │   │       ├── getToken()
│   │   │       ├── setToken()
│   │   │       └── clearToken()
│   │   │
│   │   ├── context/
│   │   │   └── AppProvider.jsx
│   │   │       └── AppProvider()
│   │   │
│   │   └── constants/
│   │       ├── routes.constants.js
│   │       ├── payment.constants.js
│   │       └── orderStatus.constants.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── theme.css
│   │
│   └── assets/
│       ├── icons/
│       ├── images/
│       └── logos/
│
├── package.json
├── vite.config.js
├── .env
└── README.md
```
