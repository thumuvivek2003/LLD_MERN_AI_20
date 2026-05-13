import NotificationToast from './NotificationToast.jsx';
export default function PaymentNotification({ amount }) {
  return <NotificationToast title="Payment Received" body={`₹${amount} credited`} />;
}
