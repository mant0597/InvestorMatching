import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building } from 'lucide-react';
import StartupProfileForm from '../components/auth/StartupProfileForm';
import InvestorProfileForm from '../components/auth/InvestorProfileForm';

const CompleteProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'profile'>('role');
  const [selectedRole, setSelectedRole] = useState<'investor' | 'startup' | null>(null);

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  React.useEffect(() => {
    // If profile already completed, redirect to dashboard
    if (user && (user as any).profileCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleRoleSelect = async (role: 'investor' | 'startup') => {
    setSelectedRole(role);
    // Update user role before moving to profile form
    await updateProfile({ role });
    setStep('profile');
  };

  if (step === 'role') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose your profile type</h2>
            <p className="text-gray-600 dark:text-gray-400">Select whether you are an investor or a startup founder</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => handleRoleSelect('investor')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all"
            >
              <User className="h-12 w-12 text-teal-600 dark:text-teal-500 mb-4" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Investor</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Looking for promising startups to invest in</span>
            </button>

            <button
              onClick={() => handleRoleSelect('startup')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all"
            >
              <Building className="h-12 w-12 text-teal-600 dark:text-teal-500 mb-4" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Startup Founder</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Seeking investment for your startup</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {selectedRole === 'startup' ? <StartupProfileForm /> : <InvestorProfileForm />}
    </div>
  );
};

export default CompleteProfilePage;
