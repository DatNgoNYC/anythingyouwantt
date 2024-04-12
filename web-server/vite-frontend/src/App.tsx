import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import DashboardProvider from './context/DashboardContext';
import { Dashboard } from './pages/Dashboard/Dashboard';

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
