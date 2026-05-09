import { useState, useEffect } from 'react';
import apiClient from '../../../shared/services/apiClient.js';
import FineCard from '../components/FineCard.jsx';
import Loader from '../../../shared/components/ui/Loader.jsx';
import EmptyState from '../../../shared/components/ui/EmptyState.jsx';

export default function FinePage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = () => {
    apiClient.get('/fines/pending')
      .then(({ data }) => setFines(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFines(); }, []);

  const handlePay = async (id) => {
    await apiClient.put(`/fines/${id}/pay`);
    fetchFines();
  };

  if (loading) return <Loader />;
  return (
    <div className="page-container">
      <h1 className="page-title">My Fines</h1>
      {fines.length === 0 ? (
        <EmptyState message="No pending fines." />
      ) : (
        fines.map((f) => <FineCard key={f._id} fine={f} onPay={handlePay} />)
      )}
    </div>
  );
}
