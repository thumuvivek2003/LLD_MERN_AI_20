import ExpenseCard from './ExpenseCard.jsx';

export default function ExpenseList({ expenses = [], members, activeUserId, onEdit, onDelete }) {
  return (
    <div className="space-y-2">
      {expenses.map((e) => (
        <ExpenseCard
          key={e.expenseId}
          expense={e}
          members={members}
          activeUserId={activeUserId}
          onEdit={onEdit ? () => onEdit(e) : undefined}
          onDelete={onDelete ? () => onDelete(e) : undefined}
        />
      ))}
    </div>
  );
}
