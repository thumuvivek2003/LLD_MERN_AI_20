import { registerAuthRoutes } from '../modules/auth/auth.routes.js';
import { registerUserRoutes } from '../modules/users/user.routes.js';
import { registerRestaurantRoutes } from '../modules/restaurants/restaurant.routes.js';
import { registerMenuItemRoutes } from '../modules/menu-items/menu-item.routes.js';
import { registerCartRoutes } from '../modules/carts/cart.routes.js';
import { registerOrderRoutes } from '../modules/orders/order.routes.js';
import { registerDeliveryRoutes } from '../modules/delivery/delivery.routes.js';
import '../modules/notifications/index.js';

export const registerAllRoutes = (app) => {
  app.use('/api/auth', registerAuthRoutes());
  app.use('/api/users', registerUserRoutes());
  app.use('/api/restaurants', registerRestaurantRoutes());
  app.use('/api/menu-items', registerMenuItemRoutes());
  app.use('/api/cart', registerCartRoutes());
  app.use('/api/orders', registerOrderRoutes());
  app.use('/api/delivery', registerDeliveryRoutes());
};
