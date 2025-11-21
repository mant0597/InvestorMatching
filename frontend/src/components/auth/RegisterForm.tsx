import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'investor' | 'startup' | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Startup-specific fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [category, setCategory] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [founderName, setFounderName] = useState('');
  const [fundingTaken, setFundingTaken] = useState(false);
  const [fundingRound, setFundingRound] = useState('pre-seed');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  // Investor-specific fields
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investmentInterests, setInvestmentInterests] = useState<string[]>([]);
  
  const { register } = useAuth();
  
  const categoryOptions = ['FinTech', 'HealthTech', 'CleanTech', 'AI', 'AgTech', 'LogisticsTech', 'E-commerce'];
  const fundingOptions = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c'];
  const investmentCategoryOptions = ['FinTech', 'HealthTech', 'CleanTech', 'AI', 'AgTech', 'LogisticsTech', 'E-commerce', 'SaaS', 'EdTech'];

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const toggleInvestmentCategory = (cat: string) => {
    if (investmentInterests.includes(cat)) {
      setInvestmentInterests(investmentInterests.filter(c => c !== cat));
    } else {
      setInvestmentInterests([...investmentInterests, cat]);
    }
  };

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
        if (role === 'startup') {
          if (!companyName || !companyEmail || !category || !foundingYear || !founderName) {
            setError('Please fill in all startup details');
            setIsLoading(false);
            return;
          }
        } else if (role === 'investor') {
          if (!investorName || !investorEmail || investmentInterests.length === 0) {
            setError('Please fill in all investor details');
            setIsLoading(false);
            return;
          }
        }
        
        const registerPayload: any = {
          name: role === 'startup' ? companyName : investorName,
          email: role === 'startup' ? companyEmail : investorEmail,
          password,
          role
        };
        
        if (role === 'startup') {
          registerPayload.profileData = {
            companyName,
            companyEmail,
            category,
            foundingYear,
            founderName,
            fundingTaken,
            fundingRound: fundingTaken ? fundingRound : null,
            description,
            pdfFile: pdfFile ? pdfFile.name : null,
            profileCompleted: true
          };
        } else if (role === 'investor') {
          registerPayload.profileData = {
            name: investorName,
            email: investorEmail,
            investmentPreferences: {
              sectors: investmentInterests
            },
            profileCompleted: true
          };
        }
        
        await register(registerPayload);
      } catch (err: any) {
        const msg = err?.body?.message || err?.message || 'Failed to create an account. Please try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
        ) : role === 'investor' ? (
          // INVESTOR FORM
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investor Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Investment Interests *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {investmentCategoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleInvestmentCategory(cat)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      investmentInterests.includes(cat)
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>
        ) : (
          // STARTUP FORM
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Startup Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Startup Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your startup name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="company@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Founding Year *
                </label>
                <input
                  type="number"
                  value={foundingYear}
                  onChange={(e) => setFoundingYear(e.target.value)}
                  min="1990"
                  max={new Date().getFullYear()}
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="2020"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CEO/Founder Name *
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Founder name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fundingTaken}
                  onChange={(e) => setFundingTaken(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Have you taken any funding?</span>
              </label>
              {fundingTaken && (
                <select
                  value={fundingRound}
                  onChange={(e) => setFundingRound(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white mt-2"
                >
                  {fundingOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                About Your Startup
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your startup, problem, solution..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Pitch Deck (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {pdfFile && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">File: {pdfFile.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
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