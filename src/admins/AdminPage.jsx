import React, { useState, useEffect } from 'react';
import CreateAdmin from './CreateAdmin.jsx';

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetch all admins
    fetch('http://localhost:5001/admins')
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error('Error fetching admins:', err));
  }, []);

  const handleDelete = async (adminId) => {
    try {
      const response = await fetch(`http://localhost:5001/admins/${adminId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Admin deleted successfully!');
        // Remove the deleted admin from state
        setAdmins(admins.filter((admin) => admin.admin_id !== adminId));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete admin. Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin.');
    }
  };

  

  return (
    <div>
      <h2>Admins</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button onClick={() => handleDelete(admin.admin_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateAdmin />
    </div>
  );
};

export default AdminPage;
