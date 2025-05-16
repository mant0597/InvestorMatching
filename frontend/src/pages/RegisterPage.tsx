import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Briefcase className="h-12 w-12 text-teal-600" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">InnovaConnect</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;