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

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/accounts/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            navigate('/');
        } else {
            console.error('Error:', response.statusText);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" name="first_name" value={formData.first_name} onChange={handleFormData} />
            </label>
            <label>
                Last Name:
                <input type="text" name="last_name" value={formData.last_name} onChange={handleFormData} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleFormData} />
            </label>
            <label>
                Username:
                <input type="text" name="username" value={formData.username} onChange={handleFormData} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={formData.password} onChange={handleFormData} />
            </label>
            <label>
                Confirm Password:
                <input type="password" name="password2" value={formData.password2} onChange={handleFormData} />
            </label>
            <input type="submit" value="Sign Up" />
        </form>
    );
};

export default SignUpForm;
