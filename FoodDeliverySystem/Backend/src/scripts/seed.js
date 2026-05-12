import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.config.js';
import { UserModel } from '../modules/users/user.model.js';
import { RestaurantModel } from '../modules/restaurants/restaurant.model.js';
import { MenuItemModel } from '../modules/menu-items/menu-item.model.js';
import { DeliveryPartnerModel } from '../modules/delivery/delivery.model.js';
import { USER_ROLES } from '../core/constants/roles.constants.js';
import { hashPassword } from '../core/utils/bcrypt.util.js';

const seed = async () => {
  await connectDatabase();
  await Promise.all([
    UserModel.deleteMany({}),
    RestaurantModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    DeliveryPartnerModel.deleteMany({}),
  ]);

  const hashed = await hashPassword('password123');

  const [admin, customer, restaurantAdmin, deliveryUser] = await UserModel.create([
    { name: 'System Admin', email: 'admin@food.com', password: hashed, role: USER_ROLES.SYSTEM_ADMIN, phoneNumber: '9999999999' },
    { name: 'John Customer', email: 'john@food.com', password: hashed, role: USER_ROLES.CUSTOMER, phoneNumber: '9000000001', address: '12 MG Road, Bengaluru', location: { lat: 12.97, lng: 77.59 } },
    { name: 'Raj Restaurant', email: 'raj@food.com', password: hashed, role: USER_ROLES.RESTAURANT_ADMIN, phoneNumber: '9000000002' },
    { name: 'Dev Delivery', email: 'dev@food.com', password: hashed, role: USER_ROLES.DELIVERY_PARTNER, phoneNumber: '9000000003', rating: 4.8 },
  ]);

  const [spicyHouse, pizzaPalace] = await RestaurantModel.create([
    {
      name: 'Spicy House', description: 'Authentic South Indian',
      address: 'Indiranagar, Bengaluru', latitude: 12.9784, longitude: 77.6408,
      rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      managedBy: restaurantAdmin._id,
    },
    {
      name: 'Pizza Palace', description: 'Wood-fired pizzas',
      address: 'Koramangala, Bengaluru', latitude: 12.9352, longitude: 77.6245,
      rating: 4.2, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    },
  ]);

  await MenuItemModel.create([
    { restaurantId: spicyHouse._id, name: 'Masala Dosa', description: 'Crispy dosa with potato filling', price: 120, category: 'Main', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600' },
    { restaurantId: spicyHouse._id, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil curry', price: 80, category: 'Breakfast', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600' },
    { restaurantId: spicyHouse._id, name: 'Chicken Biryani', description: 'Aromatic basmati rice with chicken', price: 280, category: 'Main', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600' },
    { restaurantId: pizzaPalace._id, name: 'Margherita Pizza', description: 'Classic cheese and basil', price: 350, category: 'Pizza', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600' },
    { restaurantId: pizzaPalace._id, name: 'Pepperoni Pizza', description: 'Loaded with pepperoni', price: 450, category: 'Pizza', isVeg: false, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600' },
    { restaurantId: pizzaPalace._id, name: 'Garlic Bread', description: 'Crispy garlic bread sticks', price: 150, category: 'Sides', isVeg: true, imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600' },
  ]);

  await DeliveryPartnerModel.create({
    userId: deliveryUser._id,
    name: deliveryUser.name,
    rating: 4.8,
    location: { lat: 12.97, lng: 77.62 },
  });

  console.log('\n✅ Seed complete');
  console.log('Logins (password = password123):');
  console.log('  admin@food.com   (SYSTEM_ADMIN)');
  console.log('  john@food.com    (CUSTOMER)');
  console.log('  raj@food.com     (RESTAURANT_ADMIN)');
  console.log('  dev@food.com     (DELIVERY_PARTNER)');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
