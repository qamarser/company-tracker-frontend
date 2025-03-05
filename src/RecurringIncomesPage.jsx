import React, { useEffect, useState } from 'react';

const RecurringIncomesPage = ({ role }) => {
  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingIncomeId, setEditingIncomeId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/recurring_incomes', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setIncomes(data))
      .catch(err => console.error('Error fetching recurring incomes:', err));
  }, []);

  const handleAddOrUpdateIncome = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingIncomeId
      ? `http://localhost:5001/api/recurring_incomes/${editingIncomeId}`
      : 'http://localhost:5001/api/recurring_incomes';

    const method = editingIncomeId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency, start_date: startDate, end_date: endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setIncomes(prev =>
          editingIncomeId
            ? prev.map(inc => (inc.id === editingIncomeId ? data.income : inc))
            : [...prev, data.income]
        );

        // Reset form
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
        setStartDate('');
        setEndDate('');
        setEditingIncomeId(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding/updating recurring income:', err);
      alert('Error adding/updating income. Check console for details.');
    }
  };

  const handleEditClick = (income) => {
    setEditingIncomeId(income.id);
    setTitle(income.title);
    setDescription(income.description || '');
    setAmount(income.amount);
    setCurrency(income.currency);
    setStartDate(income.start_date);
    setEndDate(income.end_date);
  };

  const handleDeleteIncome = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/recurring_incomes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setIncomes(incomes.filter(inc => inc.id !== id));
      } else {
        alert('Error deleting income');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const canEditDelete = role === 'admin' || role === 'subadmin';

  return (
    <div>
      <h2>Recurring Incomes</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map(inc => (
            <tr key={inc.id}>
              <td>{inc.title}</td>
              <td>{inc.description}</td>
              <td>{inc.amount}</td>
              <td>{inc.currency}</td>
              <td>{inc.start_date}</td>
              <td>{inc.end_date}</td>
              <td>
                {canEditDelete && (
                  <>
                    <button onClick={() => handleEditClick(inc)}>Edit</button>
                    <button onClick={() => handleDeleteIncome(inc.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editingIncomeId ? 'Edit Recurring Income' : 'Add Recurring Income'}</h3>
      <form onSubmit={handleAddOrUpdateIncome}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        
        <button type="submit">{editingIncomeId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default RecurringIncomesPage;
