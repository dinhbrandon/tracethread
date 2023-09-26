import { RootState } from './redux/store';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  // Retrieve data from the Redux store
  const isAuthenticated = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);

  return (
    <div>
      <h1>Dashboard</h1>
      {isAuthenticated && <h2>Welcome, {username}</h2>}
      {/* Add your dashboard components here */}
    </div>
  );
};

export default Dashboard;
