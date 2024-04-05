import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import AuthProvider from './context/AuthContext';
import DashboardProvider from './context/DashboardContext';

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Home />
        <Dashboard />
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
