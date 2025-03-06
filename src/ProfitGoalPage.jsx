import React, { useEffect, useState } from 'react';

const ProfitGoalPage = ({ role }) => {
  const [goals, setGoals] = useState([]); // Ensure goals is always an array
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState('');

  // Fetch all profit goals on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://finance-x1t2.onrender.com/api/profit_goals', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGoals(data);
        } else {
          console.error('Invalid API response format:', data);
          setGoals([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching profit goals:', err);
        setGoals([]);
      });
  }, []);

  // Handle adding a new profit goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://finance-x1t2.onrender.com/api/profit_goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount, currency, date }),
      });

      const data = await response.json();
      if (response.ok && data.profit_goal) {
        setGoals((prevGoals) => [...prevGoals, data.profit_goal]);
        setAmount('');
        setCurrency('');
        setDate('');
      } else {
        alert(`Error adding profit goal: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding profit goal:', err);
      alert('Error adding profit goal. Check console for details.');
    }
  };

  // Handle deleting a profit goal
  const handleDeleteGoal = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://finance-x1t2.onrender.com/api/profit_goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setGoals((prevGoals) => prevGoals.filter((goal) => goal.profit_goal_id !== id));
      } else {
        alert('Error deleting profit goal');
      }
    } catch (err) {
      console.error('Error deleting profit goal:', err);
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
          {goals && Array.isArray(goals) && goals.length > 0 ? (
            goals.map((goal) =>
              goal ? (
                <tr key={goal.profit_goal_id}>
                  <td>{goal.amount || 'N/A'}</td>
                  <td>{goal.currency || 'N/A'}</td>
                  <td>{goal.date || 'N/A'}</td>
                  {role === 'subadmin' && (
                    <td>
                      <button onClick={() => handleDeleteGoal(goal.profit_goal_id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ) : null
            )
          ) : (
            <tr>
              <td colSpan="4">No profit goals found.</td>
            </tr>
          )}
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
