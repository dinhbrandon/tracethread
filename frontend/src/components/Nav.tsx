import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/authActions'; // Import your logout action
import { RootState } from './redux/store';

const Nav = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const handleLogout = () => {
    // Dispatch the logout action to update the authentication state
    dispatch(logout());
    console.log('logout');

    // Optionally, you can perform additional logout-related actions here

    // Redirect or navigate to the desired page, e.g., the home page
    // navigate('/');
  };

  const handleLogin = () => {
    // Implement your login logic or navigation here
  };

  const handleSignup = () => {
    // Implement your signup logic or navigation here
  };

  return (
    <nav className="bg-blue-500 h-12">
      <ul className="flex gap-4">
        <li>
          <a href="http://localhost:3000">Home</a>
        </li>
        {loggedIn ? (
          <>
            <li>
              <a href="http://localhost:3000/dashboard">Dashboard</a>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="http://localhost:3000/signup" onClick={handleSignup}>
                Sign up
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/login" onClick={handleLogin}>
                Login
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
