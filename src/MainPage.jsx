// MainPage.jsx
import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IncomesPage from './dashboard/IncomesPage.jsx';
import ExpensesPage from './dashboard/ExpensesPage.jsx';
import RecurringExpensesPage from './dashboard/RecurringExpensesPage.jsx';
import RecurringIncomesPage from './dashboard/RecurringIncomesPage.jsx';
import ProfitGoalPage from './ProfitGoalPage.jsx';

const MainPage = ({ role }) => {
  const navigate = useNavigate();

  const goToAdminPage = () => {
    navigate('/admin');
  };

  const [activeTab, setActiveTab] = useState("income"); // Default tab is 'Income'

  const renderTable = () => {
    switch (activeTab) {
      case "income":
        return <IncomesPage />;
      case "expense":
        return <ExpensesPage />;
      case "recurringIncome":
        return <RecurringIncomesPage />;
      case "recurringExpense":
        return <RecurringExpensesPage />;
      default:
        return <IncomeTable />;
    }
  };
  return (
    <div>
      <h2>Welcome to the Main Screen</h2>
      {role === 'subadmin' && (
        <button onClick={goToAdminPage}>ADD</button>
      )}

<div className="finance-container">
      {/* Navigation Menu */}
      <div className="menu-bar">
        <button onClick={() => setActiveTab("income")} className={activeTab === "income" ? "active" : ""}>
          Income
        </button>
        <button onClick={() => setActiveTab("expense")} className={activeTab === "expense" ? "active" : ""}>
          Expense
        </button>
        <button onClick={() => setActiveTab("recurringIncome")} className={activeTab === "recurringIncome" ? "active" : ""}>
          Recurring Income
        </button>
        <button onClick={() => setActiveTab("recurringExpense")} className={activeTab === "recurringExpense" ? "active" : ""}>
          Recurring Expense
        </button>
      </div>

      {/* Dynamic Table Rendering */}
      <div className="table-container">{renderTable()}</div>
    </div>


      {/* <section style={{ marginTop: '2rem' }}>
        <h3>Incomes Section</h3>
        <IncomesPage role={role} />
      </section>
      {/* Expenses Section */}
     

      {/* Recurring Incomes Section */}
      {/* <section style={{ marginTop: '2rem' }}>
        <h3>Recurring Incomes</h3>
        <RecurringIncomesPage role={role} />
      </section> */}

      {/* Recurring Expenses Section */}
      {/* <section style={{ marginTop: '2rem' }}>
        <h3>Recurring Expenses</h3>
        <RecurringExpensesPage role={role} />
      </section>  */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Profit Goals</h3>
        <ProfitGoalPage role={role} />
      </section>should be like 
    </div>
      
   
  );
};

export default MainPage;
