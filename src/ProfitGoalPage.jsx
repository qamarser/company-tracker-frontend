import React, { useEffect, useState } from "react";
import Modal from "./componenets/Modal"; // Import existing Modal component
import "./styling-sheet/FinanceTable.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProfitGoalPage = ({ role }) => {
  const [goals, setGoals] = useState([]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [date, setDate] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 Show/hide modal
  const [showProgressModal, setShowProgressModal] = useState(false); // 🔹 Show/hide progress modal
  const [progress, setProgress] = useState(0); // Initialize progress state
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(null);

  const storedRole = localStorage.getItem("role");
  const token = localStorage.getItem("token") || ""; // Ensure token is defined

  useEffect(() => {
    fetchGoals();
    fetchIncome(); // Uncommented to fetch income data
  }, []);

  const fetchGoals = async () => {
    console.log("Fetching profit goals with token:", token); // Debugging line

    try {
      const response = await fetch("http://localhost:5001/profit_goals", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("❌ API Error:", response.status);
        return;
      }

      const data = await response.json();
      setGoals(data);
    } catch (err) {
      console.error("❌ Network Error Fetching Profit Goals:", err);
    }
  };

  const fetchIncome = async () => {
    try {
      const response = await fetch("http://localhost:5001/incomes", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("❌ API Error:", response.status);
        return;
      }

      const data = await response.json();
      const total = data.reduce((sum, income) => sum + income.amount, 0); // Calculate total income
      setTotalIncome(total);
    } catch (err) {
      console.error("❌ Network Error Fetching Income:", err);
    }
  };

  const handleGoalClick = async (goal) => {
    console.log("Goal clicked:", goal); // Debugging line
    setCurrentGoal(goal); // Set the current goal for progress calculation
    handleProgressClick(); // Call the progress click function
  };

  const handleProgressClick = async () => {
    console.log("Current Goal for Progress:", currentGoal); // Debugging line
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(
        `http://localhost:5001/reports/weekly?start_date=${currentGoal.date}&end_date=${today}`,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Progress fetch failed:', errorData.error);
        alert(`Error: ${errorData.error}`);
        return;
      }

      const reportData = await response.json();
      const progressPercentage = currentGoal.amount > 0
        ? Math.min((reportData.totalIncome / currentGoal.amount) * 100, 100)
        : 0;

      setProgress(progressPercentage);
      setShowProgressModal(true); // Show the progress modal

      if (progressPercentage >= 100) {
        alert("🎉 Congratulations! Profit goal reached! 🎉");
      }
    } catch (err) {
      console.error('❌ Progress fetch error:', err);
      alert('Failed to fetch progress data');
    }
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    const url = editingGoalId

      ? `http://localhost:5001/profit_goals/${editingGoalId}`
      : "http://localhost:5001/profit_goals";

    const method = editingGoalId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, currency, date }),
      });

      const data = await response.json();

      if (response.ok) {
        setGoals(prev =>
          editingGoalId ? prev.map(goal => (goal.profit_goal_id === editingGoalId ? data.profit_goal : goal)) : [...prev, data.profit_goal]
        );
        closeForm();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
    }
  };

  const handleEditClick = (goal) => {
    setEditingGoalId(goal.profit_goal_id);
    setAmount(goal.amount);
    setCurrency(goal.currency);
    setDate(goal.date);
    setShowModal(true); // Show modal for editing
  };

  const handleDeleteGoal = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/profit_goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setGoals(prev => prev.filter(goal => goal.profit_goal_id !== id));
      } else {
        alert("❌ Error deleting profit goal");
      }
    } catch (err) {
      console.error("❌ Network Error Deleting Profit Goal:", err);
    }
  };

  const openForm = () => setShowModal(true);
  const closeForm = () => {
    setShowModal(false);
    setEditingGoalId(null);
    setAmount("");
    setCurrency("");
    setDate("");
  };

  return (
    <div className="table-container">
      <div className="container-title">
        <h2>Profit Goals</h2>
        {storedRole === "subadmin" && <button className="add-btn" onClick={openForm}> Add</button>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            {storedRole === "subadmin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.profit_goal_id} onClick={() => handleGoalClick(goal)}>
              <td>{goal.amount}</td>
              <td>{goal.currency}</td>
              <td>{new Date(goal.date).toLocaleDateString()}</td>
              {storedRole === "subadmin" && (
                <td className="btn-Edit-Delete">
                  <button className="ebtn" onClick={() => handleEditClick(goal)}>✏️ Edit</button>
                  <button className="dbtn" onClick={() => handleDeleteGoal(goal.profit_goal_id)}>🗑 Delete</button>
                  <button className="progress-btn" onClick={() => handleGoalClick(goal)}>Progress</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal Popup for Adding/Editing Profit Goal */}
      <Modal isOpen={showModal} onClose={closeForm}>
        <h3>{editingGoalId ? "Edit Profit Goal" : "Add Profit Goal"}</h3>
        <form onSubmit={handleSaveGoal}>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
          <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <button type="submit" className="sbtn">{editingGoalId ? "Update" : "Add"}</button>
          <button type="button" className="sbtn cancel-btn" onClick={closeForm}>Cancel</button>
        </form>
      </Modal>

      {/* 🔹 Modal Popup for Progress */}
      <Modal isOpen={showProgressModal} onClose={() => setShowProgressModal(false)}>
        <div style={{ width: 200, height: 200, margin: "0 auto" }}>
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}
            styles={buildStyles({
              pathColor: progress >= 100 ? "#4CAF50" : "#007bff",
              textColor: progress >= 100 ? "#4CAF50" : "#007bff",
              trailColor: "#eee"
            })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProfitGoalPage;
