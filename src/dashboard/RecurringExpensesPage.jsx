import React, { useEffect, useState } from 'react';

const RecurringExpensesPage = ({ role }) => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://finance-x1t2.onrender.com/api/recurring_expenses', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Error fetching recurring expenses:', err));
  }, []);

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingExpenseId
      ? `https://finance-x1t2.onrender.com/api/recurring_expenses/${editingExpenseId}`
      : 'https://finance-x1t2.onrender.com/api/recurring_expenses';

    const method = editingExpenseId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency, start_date: startDate, end_date: endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses(prev =>
          editingExpenseId
            ? prev.map(exp => (exp.id === editingExpenseId ? data.expense : exp))
            : [...prev, data.expense]
        );

        // Reset form
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
        setStartDate('');
        setEndDate('');
        setEditingExpenseId(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding/updating recurring expense:', err);
      alert('Error adding/updating expense. Check console for details.');
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpenseId(expense.id);
    setShowForm(true); // Ensure the form is shown when editing
    setTitle(expense.title);
    setDescription(expense.description || '');
    setAmount(expense.amount);
    setCurrency(expense.currency);
    setStartDate(expense.start_date);
    setEndDate(expense.end_date);
  };


  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://finance-x1t2.onrender.com/api/recurring_expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setExpenses(expenses.filter(exp => exp.id !== id));
      } else {
        alert('Error deleting expense');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpenseId(null);
    setTitle('');
    setDescription('');
    setAmount('');
    setCurrency('');
  };

  const canEditDelete = role === 'admin' || role === 'subadmin';

  return (
    <div className="container">
      <h2>Recurring Expenses</h2>
      <button className="sbtn" onClick={() => setShowForm(true)}>Add Recurring Expense</button>
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
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>{exp.description}</td>
              <td>{exp.amount}</td>
              <td>{exp.currency}</td>
              <td>{exp.start_date}</td>
              <td>{exp.end_date}</td>
              <td>
                {canEditDelete && (
                  <>
                    <button className="ebtn" onClick={() => handleEditClick(exp)}>Edit</button>
                    <button className="ebtn" onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
      <form className="form-container" onSubmit={handleAddOrUpdateExpense}>
        <h3>{editingExpenseId ? 'Edit Recurring Expense' : 'Add Recurring Expense'}</h3>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        
        <button className="sbtn" type="submit">{editingExpenseId ? 'Update' : 'Add'}</button>
        <button type="button" className="sbtn" onClick={handleFormClose}>
        Cancel </button>
      </form>
    )}
    </div>
  );
};

export default RecurringExpensesPage;
