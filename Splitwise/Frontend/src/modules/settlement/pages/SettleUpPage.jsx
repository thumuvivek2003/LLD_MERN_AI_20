import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import SettlementForm from '../components/SettlementForm.jsx';

export default function SettleUpPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { activeUser, success, error: errorToast } = useApp();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getGroup(groupId);
        if (mounted) setGroup(data.group);
      } catch (e) {
        errorToast(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [groupId, errorToast]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await api.createSettlement(groupId, payload);
      success('Settlement recorded');
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
      <PageHeader title="Settle up" subtitle={group?.name} />
      <SettlementForm
        members={group?.members || []}
        defaultFromUserId={activeUser?.userId}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
