import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<PlaceholderPage title="Customers & Vehicles" />} />
          <Route path="/service" element={<PlaceholderPage title="Service & Billing" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventory" />} />
          <Route path="/staff" element={<PlaceholderPage title="Staff & Payroll" />} />
          <Route path="/schedule" element={<PlaceholderPage title="Schedule & Holidays" />} />
          <Route path="/expenses" element={<PlaceholderPage title="Expenses & P&L" />} />
          <Route path="/bank" element={<PlaceholderPage title="Bank & Transactions" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
