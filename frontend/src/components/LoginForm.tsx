import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getUserDetails } from './redux/authActions';
import { RootState, AppDispatch } from './redux/store';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);
  const error = useSelector((state: RootState) => state.auth.error);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    dispatch(loginUser(formData.email, formData.password));

  };
  //navigates the user if login was successful
  useEffect(() => {
    if (loggedIn) {
      navigate('/dashboard');
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch, loggedIn]);

  return (
    <div>
      {loggedIn ? (
        <p>You are logged in, {username}.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormData}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormData}
            />
          </label>
          <input type="submit" value="Log In" />
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default LoginForm;
