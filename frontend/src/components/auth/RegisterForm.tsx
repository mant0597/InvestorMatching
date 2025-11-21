// ...existing code...
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'investor' | 'startup' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1 && role) {
      setStep(2);
      return;
    }
    
    if (step === 2) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (!role) {
        setError('Please select a role');
        setStep(1);
        return;
      }
      
      setError(null);
      setIsLoading(true);
      
      try {
        // include role in payload
        await register({ name: name.trim(), email: email.trim(), password, role });
        // AuthContext will handle navigation to dashboard
      } catch (err: any) {
        const msg = err?.body?.message || err?.message || 'Failed to create an account. Please try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400">
            sign in to your existing account
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {step === 1 ? (
          <div>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                I am registering as a:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`flex flex-col items-center justify-center p-4 border ${
                    role === 'investor'
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } rounded-lg transition-colors`}
                >
                  <User className={`h-8 w-8 mb-2 ${
                    role === 'investor' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span className="font-medium">Investor</span>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Looking for opportunities</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('startup')}
                  className={`flex flex-col items-center justify-center p-4 border ${
                    role === 'startup'
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } rounded-lg transition-colors`}
                >
                  <Building className={`h-8 w-8 mb-2 ${
                    role === 'startup' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <span className="font-medium">Startup</span>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Seeking investment</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your name"
                />
              </div>
            </div>
          
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || (step === 1 && !role)}
            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 1 ? 'Continue' : (isLoading ? 'Creating account...' : 'Create account')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
// ...existing code...