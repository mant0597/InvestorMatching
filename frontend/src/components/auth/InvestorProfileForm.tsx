import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InvestorProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState((user && (user.organization as string)) || '');
  const [title, setTitle] = useState((user && (user.title as string)) || '');
  const [phone, setPhone] = useState((user && (user.phone as string)) || '');
  const [location, setLocation] = useState((user && (user.location as string)) || '');
  const [website, setWebsite] = useState((user && (user.website as string)) || '');
  const [linkedIn, setLinkedIn] = useState((user && (user.linkedIn as string)) || '');
  const [sectors, setSectors] = useState(((user && user.investmentPreferences && user.investmentPreferences.sectors) || []) as string[]);
  const [minInvestment, setMinInvestment] = useState((user && user.investmentPreferences && user.investmentPreferences.minInvestment) || undefined);
  const [maxInvestment, setMaxInvestment] = useState((user && user.investmentPreferences && user.investmentPreferences.maxInvestment) || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSector = (s: string) => {
    if (sectors.includes(s)) setSectors(sectors.filter(x => x !== s));
    else setSectors([...sectors, s]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        organization,
        title,
        phone,
        location,
        website,
        linkedIn,
        investmentPreferences: {
          ...(user && user.investmentPreferences ? user.investmentPreferences : {}),
          sectors,
          minInvestment,
          maxInvestment,
        },
        profileCompleted: true,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Complete your Investor profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
          <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
            <input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sectors of interest (click to toggle)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['FinTech','HealthTech','CleanTech','AI','AgTech','LogisticsTech','E-commerce'].map(s => (
              <button key={s} type="button" onClick={() => toggleSector(s)} className={`px-3 py-1 rounded-full border ${sectors.includes(s) ? 'bg-teal-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min investment (USD)</label>
            <input type="number" value={minInvestment as any} onChange={(e) => setMinInvestment(e.target.value ? Number(e.target.value) : undefined)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max investment (USD)</label>
            <input type="number" value={maxInvestment as any} onChange={(e) => setMaxInvestment(e.target.value ? Number(e.target.value) : undefined)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div className="text-right">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save and continue'}</button>
        </div>
      </form>
    </div>
  );
};

export default InvestorProfileForm;
