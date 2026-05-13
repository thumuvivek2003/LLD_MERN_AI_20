import NotificationToast from './NotificationToast.jsx';
export default function RideAcceptedNotification({ driverName }) {
  return <NotificationToast title="Driver Accepted" body={`${driverName || 'Your driver'} is on the way`} />;
}
