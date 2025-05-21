import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

const RepaymentForm = () => {
  const { tripId } = useParams();
  const [users, setUsers] = useState([]);
  const [paidTo, setPaidTo] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    API.get(`/trip/${tripId}/members`).then(res => {
      setUsers(res.data.users); // Assume backend gives trip users
    });
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post(`/repayment/${tripId}`, { paidTo, amount });
    alert('Repayment recorded!');
    setAmount('');
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Repayment</h2>
      <form onSubmit={handleSubmit}>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
        >
          <option>Select person to repay</option>
          {users.map((user) => (
            <option value={user.id} key={user.id}>{user.username}</option>
          ))}
        </select>
        <input
          type="number"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RepaymentForm;
