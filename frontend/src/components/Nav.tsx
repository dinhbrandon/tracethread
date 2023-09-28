import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/authActions';
import { RootState } from './redux/store';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-blue-500 h-12">
      <ul className="flex gap-4">
        <li>
            <span>[{username}]</span>
        </li>
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
            <li>
              <a href="http://localhost:3000/jobnotebook">Job Notebook</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="http://localhost:3000/signup">
                Sign up
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/login">
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
