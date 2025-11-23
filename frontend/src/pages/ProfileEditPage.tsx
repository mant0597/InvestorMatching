import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, DollarSign, Users, Briefcase, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileEditPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        sector: '',
        fundingStage: 'Seed',
        currentValuation: 0,
        fundingAmount: 0,
        teamSize: 1,
        founderName: '',
        founderExperience: '',
    });

    const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:4000';

    useEffect(() => {
        // Fetch current profile data
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${API_BASE}/api/investor/${user.id}`); // Reusing getById for now
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        companyName: data.companyName || '',
                        description: data.description || '',
                        sector: data.sector || data.category || '',
                        fundingStage: data.fundingStage || data.fundingRound || 'Seed',
                        currentValuation: data.currentValuation || 0,
                        fundingAmount: data.fundingAmount || 0,
                        teamSize: data.teamSize || 1,
                        founderName: data.founderName || data.name || '',
                        founderExperience: data.founderExperience || '',
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'currentValuation' || name === 'fundingAmount' || name === 'teamSize'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('innova_token');
            const res = await fetch(`${API_BASE}/api/startup/update-profile`, { // Need to ensure this route exists
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update profile');

            setSuccess('Profile updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
                        {success && <div className="p-4 bg-green-50 text-green-700 rounded-md">{success}</div>}

                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-teal-500" /> Company Details
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sector</label>
                                    <select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    >
                                        <option value="">Select Sector</option>
                                        <option value="FinTech">FinTech</option>
                                        <option value="HealthTech">HealthTech</option>
                                        <option value="CleanTech">CleanTech</option>
                                        <option value="AI">AI</option>
                                        <option value="AgTech">AgTech</option>
                                        <option value="LogisticsTech">LogisticsTech</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="EdTech">EdTech</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-500" /> Financials & Funding
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Valuation ($)</label>
                                    <input
                                        type="number"
                                        name="currentValuation"
                                        value={formData.currentValuation}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Funding Raised ($)</label>
                                    <input
                                        type="number"
                                        name="fundingAmount"
                                        value={formData.fundingAmount}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Funding Stage</label>
                                    <select
                                        name="fundingStage"
                                        value={formData.fundingStage}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    >
                                        <option value="Pre-Seed">Pre-Seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                        <option value="Series C+">Series C+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" /> Team & Founder
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Founder Name</label>
                                    <input
                                        type="text"
                                        name="founderName"
                                        value={formData.founderName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Size</label>
                                    <input
                                        type="number"
                                        name="teamSize"
                                        value={formData.teamSize}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Founder Experience</label>
                                    <textarea
                                        name="founderExperience"
                                        rows={3}
                                        value={formData.founderExperience}
                                        onChange={handleChange}
                                        placeholder="e.g. Ex-Google, 2x Founder..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;
