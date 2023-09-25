import { useState, ChangeEvent, FormEvent } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  return (
    <div>
      Login
    </div>
  )
}

export default LoginForm
