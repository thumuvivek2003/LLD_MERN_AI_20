// components/TransactionCard.jsx
function TransactionCard({ transaction }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{transaction.bookTitle}</h3>
      <p className="text-gray-600 mb-2">User: {transaction.userName}</p>
      <p className="text-gray-600 mb-2">
        Issued: {new Date(transaction.issueDate).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        Due: {new Date(transaction.dueDate).toLocaleDateString()}
      </p>
      {transaction.returnDate && (
        <p className="text-gray-600 mb-2">
          Returned: {new Date(transaction.returnDate).toLocaleDateString()}
        </p>
      )}
      <p className={`mb-4 ${transaction.status === 'returned' ? 'text-green-600' : 'text-blue-600'}`}>
        Status: {transaction.status}
      </p>
    </div>
  );
}

export default TransactionCard;