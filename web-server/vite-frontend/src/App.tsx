import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import { AuthProvider } from './context/AuthContext';
import DashboardProvider from './context/DashboardContext';

function App() {
  return (
    <AuthProvider> // provides the unqieueId of the user, null if no one is signed in.
      <DashboardProvider> // COME BACK TO THIS
        <Home />
        <Dashboard />
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
