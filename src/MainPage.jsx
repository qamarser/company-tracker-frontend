// MainPage.jsx
import React from 'react';
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

  return (
    <div>
      <h2>Welcome to the Main Screen</h2>
      {role === 'subadmin' && (
        <button onClick={goToAdminPage}>ADD</button>
      )}

      <section style={{ marginTop: '2rem' }}>
        <h3>Incomes Section</h3>
        <IncomesPage role={role} />
      </section>
      {/* Expenses Section */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Expenses Section</h3>
        <ExpensesPage role={role} /> 
      </section>

      {/* Recurring Incomes Section */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Recurring Incomes</h3>
        <RecurringIncomesPage role={role} />
      </section>

      {/* Recurring Expenses Section */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Recurring Expenses</h3>
        <RecurringExpensesPage role={role} />
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h3>Profit Goals</h3>
        <ProfitGoalPage role={role} />
      </section>should be like 
    </div>
      
   
  );
};

export default MainPage;
