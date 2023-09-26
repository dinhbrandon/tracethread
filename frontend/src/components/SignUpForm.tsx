import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    password2: string;
}

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
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
              value={formData.first_name}
              onChange={handleFormData}
            />
            {errors.first_name && <span className="error">{errors.first_name}</span>}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              pattern="[A-Za-zÀ-ÖØ-öø-ÿ\-']+"
              value={formData.last_name}
              onChange={handleFormData}
            />
            {errors.last_name && <span className="error">{errors.last_name}</span>}
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormData}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormData}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormData}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleFormData}
            />
            {errors.password2 && <span className="error">{errors.password2}</span>}
          </label>
          <input type="submit" value="Sign Up" />
        </form>
      );
};

export default SignUpForm;
