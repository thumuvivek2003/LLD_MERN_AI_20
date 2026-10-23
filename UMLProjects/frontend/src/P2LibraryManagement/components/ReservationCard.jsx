// components/ReservationCard.jsx
function ReservationCard({ reservation, onCancel }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{reservation.bookTitle}</h3>
      <p className="text-gray-600 mb-2">Reserved By: {reservation.userName}</p>
      <p className="text-gray-600 mb-2">Date: {new Date(reservation.date).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-4">
        Status: <span className="text-yellow-600">{reservation.status}</span>
      </p>
      {onCancel && (
        <button
          onClick={() => onCancel(reservation)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancel Reservation
        </button>
      )}
    </div>
  );
}

export default ReservationCard;