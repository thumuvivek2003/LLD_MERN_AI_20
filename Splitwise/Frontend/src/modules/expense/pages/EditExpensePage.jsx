import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';

export default function EditExpensePage() {
  const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const { success, error: errorToast } = useApp();

  const [group, setGroup] = useState(null);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [g, e] = await Promise.all([
          api.getGroup(groupId),
          api.getExpense(expenseId)
        ]);
        if (mounted) {
          setGroup(g.group);
          setExpense(e.expense);
        }
      } catch (err) {
        errorToast(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [groupId, expenseId, errorToast]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await api.updateExpense(expenseId, payload);
      success('Expense updated');
      navigate(`/groups/${groupId}`);
    } catch (e) {
      errorToast(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-xl mx-auto">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 max-w-xl mx-auto">
      <PageHeader title="Edit expense" subtitle={group?.name} />
      <ExpenseForm
        members={group?.members || []}
        initial={expense}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
