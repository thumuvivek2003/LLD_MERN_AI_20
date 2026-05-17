import CartItem from './CartItem.jsx';

export default function CartList({ items }) {
  return (
    <div className="card divide-y-0">
      {items.map((item) => (
        <CartItem key={item.productId} item={item} />
      ))}
    </div>
  );
}
