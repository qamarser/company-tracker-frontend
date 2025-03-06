// IncomesPage.jsx
import React, { useEffect, useState } from 'react';

const IncomesPage = ({ role }) => {
  const [incomes, setIncomes] = useState([]);

  // For add/edit
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [loggedInAdminId, setLoggedInAdminId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setLoggedInAdminId(user.admin_id);
    }
  
    fetch('http://localhost:5001/incomes', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched incomes:', data);
        if (Array.isArray(data)) {
          setIncomes(data);
        } else {
          console.error('Incomes fetch error:', data);
        }
      })
      .catch((err) => console.error('Error fetching incomes:', err));
  }, []);

  const canAdd = (role === 'admin' || role === 'subadmin');

  // -------------- ADD --------------
  const handleAddIncome = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, amount, currency }),
      });
      const data = await response.json();
      console.log('We are in Add Income');

      if (response.ok) {
        alert('Income created successfully!');
        setIncomes((prev) => [...prev, data.income]);
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
        console.log('Creating income with admin_id:', req.user.admin_id);

      } else {
        alert(`Failed to create income. Error: ${data.error}`);
        console.log('Creating income with admin_id:', req.user.admin_id);

      }
    } catch (err) {
      console.error('Error creating income:', err);
      alert('Error creating income. Check console for details.');

    }
  };

  // -------------- EDIT --------------
  const handleEditClick = (income) => {
    setEditingIncomeId(income.id);
    setTitle(income.title);
    setDescription(income.description || '');
    setAmount(income.amount);
    setCurrency(income.currency);
    setShowForm(true); 
  };

    // -------------- Cancel --------------
    const handleFormClose = () => {
      setShowForm(false);
      setEditingIncomeId(null);
      setTitle('');
      setDescription('');
      setAmount('');
      setCurrency('');
    };
    
  // -------------- UPDATE --------------
  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/incomes/${editingIncomeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, amount, currency }),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Income updated successfully!');
        setIncomes((prev) =>
          prev.map((inc) => (inc.id === editingIncomeId ? data.income : inc))
        );
        setEditingIncomeId(null);
        setTitle('');
        setDescription('');
        setAmount('');
        setCurrency('');
      } else {
        alert(`Failed to update income. Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error updating income:', err);
      alert('Error updating income. Check console for details.');
    }
  };

  // -------------- DELETE --------------
  const handleDeleteIncome = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/incomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        alert('Income deleted successfully!');
        setIncomes((prev) => prev.filter((inc) => inc.id !== id));
      } else {
        alert(`Failed to delete income. Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error deleting income:', err);
      alert('Error deleting income. Check console for details.');
    }
  };


  return (
    <div className="container">
      <h2>Incomes</h2>
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
          {Array.isArray(incomes) && incomes.map((income) => {
            // subadmin can do everything (edit/delete)
            // admin might have partial, enforced by backend
            const canEditDelete = role === 'admin' || role === 'subadmin';

            const handleFormClose = () => {
              setShowForm(false);
              setEditingIncomeId(null);
              setTitle('');
              setDescription('');
              setAmount('');
              setCurrency('');
            };
            

            return (
              <tr key={income.id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{income.amount}</td>
                <td>{income.currency}</td>
                <td>
                  {canEditDelete && (
                    <>
                      <button className="ebtn" onClick={() => handleEditClick(income)}>Edit</button>
                      <button className="ebtn" onClick={() => handleDeleteIncome(income.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {canAdd && (
        <div style={{ marginTop: '2rem' }}>
          {showForm && (
          <form className="form-container" onSubmit={editingIncomeId ? handleUpdateIncome : handleAddIncome}>
             <h3>{editingIncomeId ? 'Edit Income' : 'Add Income'}</h3>


              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

          
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
           
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
              
            <button type="submit" className="sbtn" >
              {editingIncomeId ? 'Update' : 'Add'}
            </button>
            <button type="button" className="sbtn" onClick={handleFormClose}>
                    Cancel </button>
          </form>
         )}
        </div>
      )}
    </div>
  );
};

export default IncomesPage;
