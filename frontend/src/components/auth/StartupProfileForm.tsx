import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StartupProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState((user && (user.companyName as string)) || '');
  const [description, setDescription] = useState((user && (user.description as string)) || '');
  const [foundedYear, setFoundedYear] = useState((user && (user.foundedYear as number)) || new Date().getFullYear());
  const [category, setCategory] = useState((user && (user.category as string)) || '');
  const [website, setWebsite] = useState((user && (user.website as string)) || '');
  const [traction, setTraction] = useState((user && (user.traction as string)) || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // optimistic local update
      await updateProfile({
        companyName,
        description,
        foundedYear,
        category,
        website,
        traction,
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Complete your Startup profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company name</label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Founded year</label>
            <input type="number" value={foundedYear} onChange={(e) => setFoundedYear(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Traction / highlights</label>
          <input value={traction} onChange={(e) => setTraction(e.target.value)} className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-gray-700" />
        </div>

        <div className="text-right">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save and continue'}</button>
        </div>
      </form>
    </div>
  );
};

export default StartupProfileForm;
