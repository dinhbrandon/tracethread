import { useState, useEffect, ChangeEvent, FormEvent, forwardRef, Ref } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getUserDetails, clearError } from '../redux/authActions';
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
        dispatch(clearError());
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

    dispatch(clearError());

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
                            <div className='flex items-center justify-center'>
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div> 
                          </div>
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
