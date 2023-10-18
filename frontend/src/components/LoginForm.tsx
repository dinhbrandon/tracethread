import { useState, useEffect, ChangeEvent, FormEvent, forwardRef, Ref } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getUserDetails } from '../redux/authActions';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { SignupLoginProps } from '../types/types';

const LoginForm = forwardRef<HTMLDivElement, SignupLoginProps>((props: SignupLoginProps, ref: Ref<HTMLDivElement>) => {
    const { toggleSignUpModal, toggleLoginModal } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    const username = useSelector((state: RootState) => state.auth.username);
    const error = useSelector((state: RootState) => state.auth.error);

    const [loading, setLoading] = useState(false);

    const toggleModals = () => {
        toggleLoginModal();
        toggleSignUpModal();
    };


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  const handleFormData = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    setLoading(true);
    await dispatch(loginUser(formData.email, formData.password));
    setLoading(false);

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
    <div ref={ref} className="h-full flex items-center py-16">
        <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800">
                            Login
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button onClick={toggleModals} className="decoration-2 hover:underline font-medium">
                                Sign up here
                            </button>
                        </p>
                    </div>

                    <div className="mt-5">
                        {loading ? (
                            <div>Loading...</div>
                        ) : loggedIn ? (
                            <p>You are logged in, {username}.</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col w-80 gap-6">

                                    {/* Email input box */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-2">
                                            Email address:
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm"
                                                value={formData.email}
                                                onChange={handleFormData}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password input box */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm mb-2">
                                            Password:
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="border py-3 px-4 block border-gray-300 w-full rounded-md text-sm"
                                                value={formData.password}
                                                onChange={handleFormData}
                                                required
                                                aria-describedby="password-error"
                                            />
                                            <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                                <svg
                                                    className="h-5 w-5 text-red-500"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        
                                    </div>

                                <button
                                    type="submit"
                                    className="bg-white text-black border-gray-300 border mt-3 py-3 inline-flex justify-center items-center gap-2 rounded-md font-semibol text-sm w-full"
                                >
                                    Login
                                </button>
                                </div>

                                {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
);


});

export default LoginForm;
