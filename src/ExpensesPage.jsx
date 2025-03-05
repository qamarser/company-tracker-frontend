import React, { useEffect, useState } from 'react';

const ExpensesPage = ({ role }) => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/expenses', {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Error fetching expenses:', err));
  }, []);

  const canEditDelete = role === 'admin' || role === 'subadmin';

  // ✅ Add handleEditClick Function
  const handleEditClick = (expense) => {
    setEditingExpenseId(expense.id);
    setTitle(expense.title);
    setDescription(expense.description || '');
    setAmount(expense.amount);
    setCurrency(expense.currency);
  };

  // ✅ Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5001/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency }),
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses([...expenses, data.expense]);
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Error adding expense. Check console for details.');
    }
  };

  // ✅ Delete Expense
  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5001/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert('Expense deleted successfully!');
        setExpenses(expenses.filter((exp) => exp.id !== id));
      } else {
        alert(`Failed to delete expense. Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Error deleting expense. Check console for details.');
    }
  };

  // ✅ Update Expense
  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5001/api/expenses/${editingExpenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Expense updated successfully!');
        setExpenses(expenses.map(exp => (exp.id === editingExpenseId ? data.expense : exp)));
        setEditingExpenseId(null);
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
      } else {
        alert(`Failed to update expense. Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Error updating expense. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
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
              <td>
                {canEditDelete && (
                  <>
                    <button onClick={() => handleEditClick(exp)}>Edit</button>
                    <button onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editingExpenseId ? 'Edit Expense' : 'Add Expense'}</h3>
      <form onSubmit={editingExpenseId ? handleUpdateExpense : handleAddExpense}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
        
        <button type="submit">
          {editingExpenseId ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default ExpensesPage;
