import React, { useEffect, useState } from 'react';

const ProfitGoalPage = ({ role }) => {
  const [goals, setGoals] = useState([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/profit_goals', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error('Error fetching profit goals:', err));
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('http://localhost:5001/api/profit_goals', { // Ensure this matches backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount, currency, date }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setGoals([...goals, data.goal]);
      } else {
        alert(`Error adding profit goal: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding profit goal:', err);
      alert('Error adding profit goal. Check console for details.');
    }
  };
  

  const handleDeleteGoal = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5001/api/profit_goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setGoals(goals.filter(goal => goal.profit_goal_id !== id));
      } else {
        alert('Error deleting profit goal');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h2>Profit Goals</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            {role === 'subadmin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.profit_goal_id}>
              <td>{goal.amount}</td>
              <td>{goal.currency}</td>
              <td>{goal.date}</td>
              {role === 'subadmin' && (
                <td>
                  <button onClick={() => handleDeleteGoal(goal.profit_goal_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {role === 'subadmin' && (
        <>
          <h3>Add Profit Goal</h3>
          <form onSubmit={handleAddGoal}>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
            <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
            
            <button type="submit">Add</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfitGoalPage;
