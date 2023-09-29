import { useDispatch } from 'react-redux';
import { logout } from '../redux/authActions';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
