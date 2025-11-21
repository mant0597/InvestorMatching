import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus } from 'lucide-react';

interface Founder {
  name: string;
  role: string;
}

const StartupProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState((user && (user.companyName as string)) || '');
  const [companyEmail, setCompanyEmail] = useState((user && (user.companyEmail as string)) || '');
  const [category, setCategory] = useState((user && (user.category as string)) || '');
  const [foundingYear, setFoundingYear] = useState((user && (user.foundingYear as string)) || '');
  const [founderName, setFounderName] = useState((user && (user.founderName as string)) || '');
  const [coFounders, setCoFounders] = useState<Founder[]>((user && (user.coFounders as Founder[])) || []);
  const [fundingTaken, setFundingTaken] = useState((user && (user.fundingTaken as boolean)) || false);
  const [fundingRound, setFundingRound] = useState((user && (user.fundingRound as string)) || 'pre-seed');
  const [description, setDescription] = useState((user && (user.description as string)) || '');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCoFounderName, setNewCoFounderName] = useState('');
  const [newCoFounderRole, setNewCoFounderRole] = useState('');

  const handleAddCoFounder = () => {
    if (newCoFounderName.trim()) {
      setCoFounders([...coFounders, { name: newCoFounderName, role: newCoFounderRole }]);
      setNewCoFounderName('');
      setNewCoFounderRole('');
    }
  };

  const handleRemoveCoFounder = (index: number) => {
    setCoFounders(coFounders.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
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
        companyName,
        companyEmail,
        category,
        foundingYear,
        founderName,
        coFounders,
        fundingTaken,
        fundingRound: fundingTaken ? fundingRound : null,
        description,
        pdfFile: pdfFile ? pdfFile.name : null,
        password,
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

  const fundingOptions = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c'];
  const categoryOptions = ['FinTech', 'HealthTech', 'CleanTech', 'AI', 'AgTech', 'LogisticsTech', 'E-commerce'];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Complete your Startup Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Startup Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Founding Year *</label>
              <input
                type="number"
                value={foundingYear}
                onChange={(e) => setFoundingYear(e.target.value)}
                min="1990"
                max={new Date().getFullYear()}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 2020"
              />
            </div>
          </div>
        </div>

        {/* Founders */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Founder Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEO/Founder Name *</label>
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Co-Founders</h4>
            <div className="space-y-3">
              {coFounders.map((founder, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{founder.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{founder.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoFounder(idx)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Co-founder name"
                  value={newCoFounderName}
                  onChange={(e) => setNewCoFounderName(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Role (e.g., CTO, CFO)"
                  value={newCoFounderRole}
                  onChange={(e) => setNewCoFounderRole(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCoFounder}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add Co-Founder
              </button>
            </div>
          </div>
        </div>

        {/* Funding */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Funding Information</h3>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fundingTaken}
                onChange={(e) => setFundingTaken(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Have you taken any funding?</span>
            </label>
          </div>

          {fundingTaken && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funding Round *</label>
              <select
                value={fundingRound}
                onChange={(e) => setFundingRound(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {fundingOptions.map((round) => (
                  <option key={round} value={round}>
                    {round.toUpperCase().replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Your Startup</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your startup, what you do, your vision, etc."
            />
          </div>
        </div>

        {/* PDF Upload */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pitch Deck / Business Plan (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="w-full"
              />
              {pdfFile && <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">File selected: {pdfFile.name}</p>}
            </div>
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

export default StartupProfileForm;
