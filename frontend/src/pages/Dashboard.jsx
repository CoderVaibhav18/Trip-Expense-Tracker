import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

const Dashboard = () => {
  const { tripId } = useParams();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    API.get(`/balance/${tripId}/balance`).then(res => {      
      setBalances(res.data.data.balances);
    });
  }, [tripId]);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Trip Balances</h2>
      <ul className="bg-white shadow rounded-lg divide-y">
        {balances.map((b) => (
          <li key={b.user_id} className="p-4 flex justify-between">
            <span>{b.name}</span>
            <span>{b.total_paid}</span>
            <span>{b.total_share}</span>
            <span className={`${b.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{b.balance.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
