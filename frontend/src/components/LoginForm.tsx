import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getUserDetails } from '../redux/authActions';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);
  const error = useSelector((state: RootState) => state.auth.error);

  const [loading, setLoading] = useState(false);

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
    <div className="h-full dark:bg-slate-900 flex items-center py-16">
        <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                            Login
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <a className="text-blue-600 decoration-2 hover:underline font-medium" href="../examples/html/signup.html">
                                Sign up here
                            </a>
                        </p>
                    </div>

                    <div className="mt-5">
                        {loading ? (
                            <div>Loading...</div>
                        ) : loggedIn ? (
                            <p>You are logged in, {username}.</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">

                                    {/* Email input box */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                                            Email address:
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                value={formData.email}
                                                onChange={handleFormData}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password input box */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                                            Password:
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                                value={formData.password}
                                                onChange={handleFormData}
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                >
                                    Log In
                                </button>
                                {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
);

};

export default LoginForm;
