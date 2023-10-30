import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { loginUser } from '../redux/authActions';
import { useNavigate } from 'react-router-dom';

const GuestLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGuestLogin = async () => {
    function generateRandomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    const guestUserNumberFormatted = generateRandomString();
    const email = `${guestUserNumberFormatted}@tracethread.com`;
    const guestPassword = 'thisisapassword';

    try {
        const response = await fetch('http://localhost:8000/accounts/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: 'Guest',
            last_name: '',
            email: email,
            username: email,
            password: guestPassword,
            password2: guestPassword,
          }),
        });

        if (response.ok) {
            try {
                await dispatch(loginUser(email, guestPassword));
                navigate('/dashboard');
            } catch (error) {
                console.error('Login Error:', error);
            }
        } else {
            console.error('Registration Error:', response.statusText);
        }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGuestLogin}
      className="bg-sky-600 py-3 px-4 inline-flex justify-center ml-8 items-center gap-2 rounded-md border font-medium text-white shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm "
    >
      Guest Login
    </button>
  );
};

export default GuestLoginButton;
