import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to={'account'}>You</Link>
          </li>
          <li>
            <Link to={'orders'}>What you wanted</Link>
          </li>
        </ul>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

export default Dashboard;
