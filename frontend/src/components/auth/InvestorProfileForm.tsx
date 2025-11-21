import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InvestorProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [investorName, setInvestorName] = useState((user && (user.investorName as string)) || (user && (user.name as string)) || '');
  const [email, setEmail] = useState((user && (user.email as string)) || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interestCategories, setInterestCategories] = useState<string[]>(
    (user && user.investmentPreferences && user.investmentPreferences.sectors) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = ['FinTech', 'HealthTech', 'CleanTech', 'AI', 'AgTech', 'LogisticsTech', 'E-commerce', 'SaaS', 'EdTech'];

  const toggleCategory = (category: string) => {
    setInterestCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        investorName,
        email,
        password,
        investmentPreferences: {
          ...(user && user.investmentPreferences ? user.investmentPreferences : {}),
          sectors: interestCategories,
        },
        profileCompleted: true,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Complete your Investor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Interests</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the startup categories you are interested in investing in:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  interestCategories.includes(category)
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestorProfileForm;
