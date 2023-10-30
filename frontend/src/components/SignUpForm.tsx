import { useState, useEffect, ChangeEvent, FormEvent, forwardRef, Ref } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData, SignupLoginProps } from '../types/types'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/authActions';

const SignUpForm = forwardRef<HTMLDivElement, SignupLoginProps>((props: SignupLoginProps, ref: Ref<HTMLDivElement>) => {
  const { toggleSignUpModal, toggleLoginModal } = props;
  const dispatch = useDispatch<AppDispatch>();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const navigate = useNavigate();


    const switchToLogin = () => {
      toggleSignUpModal();
      toggleLoginModal();
  }

    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        password2: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        password2: '',
    });

    const errorMessages: Record<string, string> = {
        first_name: 'Please enter your first name.',
        last_name: 'Please enter your last name.',
        email: 'Please enter a valid email address.',
        username: 'Please enter a username.',
        password: 'Password must be at least 8 characters long.',
        password2: 'Passwords do not match.',
    };

    const validateInput = (name: string, value: string): string => {
        switch (name) {
          case 'first_name':
            return value.trim() ? '' : errorMessages.first_name;
          case 'last_name':
            return value.trim() ? '' : errorMessages.last_name;
          case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(value) ? '' : errorMessages.email;
          case 'username':
            return value.trim() ? '' : errorMessages.username;
          case 'password':
            return value.length >= 8 ? '' : errorMessages.password;
          case 'password2':
            return value === formData.password ? '' : errorMessages.password2;
          default:
            return '';
        }
    };

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));

        const validationError = validateInput(name, value);
            setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationError,
        }));
      };

      // const capitalizeName = (name: string): string => {
      //   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      // };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors({});

        const email = formData.email.toLowerCase();

        const formDataWithCapitalizedNames = {
          ...formData,
          username: email,
          first_name: "",
          last_name: "",
        };
    
        try {
            const response = await fetch('http://13.56.237.212/accounts/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithCapitalizedNames),
            });

            if (response.ok) {
              try {
                  await dispatch(loginUser(formData.email, formData.password));
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

    useEffect(() => {
      if (loggedIn) {
        navigate('/dashboard');
      }
    }, [loggedIn, navigate]);
  

      return (
        <div ref={ref} className="h-full flex items-center py-16">
          <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm ">
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 ">
                    Sign up
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      className="text-black decoration-2 hover:underline font-medium"
                      type='button'
                      onClick={switchToLogin}
                    >
                     Login here
                    </button>
                  </p>
                </div>

                <div className="mt-5">
                  <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-black shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm ">
                    <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                      <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                      <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                      <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
                      <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
                    </svg>
                    Sign up with Google
                  </button>
                <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6">Or</div>
              </div>
      
                <div className="mt-5">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-y-4">

                      {/* First Name input box */}
                      {/* <div>
                        <label htmlFor="first_name" className="block text-sm mb-2 dark:text-white">
                          First Name:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
                            className="border-2 py-3 px-4 block border-black w-full rounded-md text-sm"
                            value={formData.first_name}
                            onChange={handleFormData}
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
                        {errors.first_name && (
                          <span className="text-xs text-red-600 mt-2">{errors.first_name}</span>
                        )}
                      </div> */}
                    
                      {/* Last Name input box */}
                      {/* <div>
                        <label htmlFor="last_name" className="block text-sm mb-2 dark:text-white">
                          Last Name:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
                            className="border-2 py-3 px-4 block border-black w-full rounded-md text-sm"
                            value={formData.last_name}
                            onChange={handleFormData}
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
                        {errors.last_name && (
                          <span className="text-xs text-red-600 mt-2">{errors.last_name}</span>
                        )}
                      </div> */}

                      {/* Username input box */}
                      {/* <div>
                        <label htmlFor="username" className="block text-sm mb-2 dark:text-white">
                          Username:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            className="border-2 py-3 px-4 block border-black w-full rounded-md text-sm"
                            value={formData.username}
                            onChange={handleFormData}
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
                        {errors.username && (
                          <span className="text-xs text-red-600 mt-2">{errors.username}</span>
                        )}
                      </div> */}

                      {/* Email input box */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm mb-2"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="border py-3 px-4 block border-gray-300 w-full rounded-md text-sm"
                            value={formData.email}
                            onChange={handleFormData}
                            required
                            aria-describedby="email-error"
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
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-2" id="email-error">
                            {errors.email}
                          </p>
                        )}
                      </div>
      
                      {/* Password input box */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm mb-2"
                        >
                          Password
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
                        {errors.password && (
                          <p className="text-xs text-red-600 mt-2" id="password-error">
                            {errors.password}
                          </p>
                        )}
                      </div>
                      
                      {/* Confirm Password input box */}
                      <div>
                        <label htmlFor="password2" className="block text-sm mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            id="password2"
                            name="password2"
                            className="border py-3 px-4 block border-gray-300 w-full rounded-md text-sm"
                            value={formData.password2}
                            onChange={handleFormData}
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
                        {errors.password2 && (
                          <p className="text-xs text-red-600 mt-2" id="password2-error">
                            {errors.password2}
                          </p>
                        )}
                      </div>
                      
                    </div>
      
                    <button
                      type="submit"
                      className="bg-white text-black border-gray-300 border mt-5 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibol text-sm w-full"
                    >
                      Sign up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
});

export default SignUpForm;
