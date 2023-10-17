import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData } from '../types/types'

const SignUpForm = () => {
    const navigate = useNavigate();

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

      const capitalizeName = (name: string): string => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors({});

        const formDataWithCapitalizedNames = {
          ...formData,
          first_name: capitalizeName(formData.first_name),
          last_name: capitalizeName(formData.last_name),
        };
    
        try {
            const response = await fetch('http://localhost:8000/accounts/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithCapitalizedNames),
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

      return (
        <div className="h-full dark:bg-slate-900 flex items-center py-16">
          <main className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                    Sign up
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <a
                      className="text-blue-600 decoration-2 hover:underline font-medium"
                      href="../examples/html/signin.html"
                    >
                      Sign in here
                    </a>
                  </p>
                </div>
      
                <div className="mt-5">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-y-4">

                      {/* First Name input box */}
                      <div>
                        <label htmlFor="first_name" className="block text-sm mb-2 dark:text-white">
                          First Name:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
                            className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                          <span className="error">{errors.first_name}</span>
                        )}
                      </div>
                    
                      {/* Last Name input box */}
                      <div>
                        <label htmlFor="last_name" className="block text-sm mb-2 dark:text-white">
                          Last Name:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
                            className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                          <span className="error">{errors.last_name}</span>
                        )}
                      </div>

                      {/* Username input box */}
                      <div>
                        <label htmlFor="username" className="block text-sm mb-2 dark:text-white">
                          Username:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
                          <span className="error">{errors.username}</span>
                        )}
                      </div>

                      {/* Email input box */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm mb-2 dark:text-white"
                        >
                          Email address
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
                          className="block text-sm mb-2 dark:text-white"
                        >
                          Password
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
                        <label htmlFor="password2" className="block text-sm mb-2 dark:text-white">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            id="password2"
                            name="password2"
                            className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
      
                    <div className="flex items-center">
                      <div className="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor="remember-me"
                          className="text-sm dark:text-white"
                        >
                          I accept the{" "}
                          <a
                            className="text-blue-600 decoration-2 hover:underline font-medium"
                            href="#"
                          >
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                    </div>
      
                    <button
                      type="submit"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
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
};

export default SignUpForm;
