import Home from './pages/home/Home';
import { AuthProvider } from './context/AuthContext';
import DashboardProvider from './context/DashboardContext';
import { Dashboard } from './pages/dashboard/Dashboard';

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
