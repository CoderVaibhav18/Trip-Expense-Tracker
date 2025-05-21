import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/api';

const RepaymentHistory = () => {
  const { tripId } = useParams();
  const [repayments, setRepayments] = useState([]);

  useEffect(() => {
    API.get(`/repayment/${tripId}`).then(res => {
      setRepayments(res.data.repayments);
    });
  }, [tripId]);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Repayment History</h2>
      <ul className="bg-white shadow rounded-lg divide-y">
        {repayments.map((r) => (
          <li key={r.id} className="p-4">
            <p><b>{r.fromUser}</b> paid <b>{r.toUser}</b> ₹{r.amount}</p>
            <p className="text-sm text-gray-500">{new Date(r.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepaymentHistory;
