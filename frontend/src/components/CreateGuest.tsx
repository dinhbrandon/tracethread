import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { loginUser } from '../redux/authActions';
import { useNavigate } from 'react-router-dom';

const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

const GuestLoginButton = ( {loadWheel}: any ) => {
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
        const response = await fetch(`${baseUrlApi}/accounts/register`, {
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

  const handleClick = () => {
    handleGuestLogin();
    loadWheel();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sky-800 decoration-2 hover:underline font-medium"
    >
      Try explorer mode
    </button>
  );
};

export default GuestLoginButton;
