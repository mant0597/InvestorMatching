import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Contract {
    _id: string;
    investorId: { _id: string; name: string };
    amount: number;
    equity: number;
    valuation: number;
    conditions: string;
    status: string;
    contractAddress: string;
    createdAt: string;
}

const StartupProposalsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    // Counter Offer State
    const [isCounterOpen, setIsCounterOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [counterAmount, setCounterAmount] = useState('');
    const [counterEquity, setCounterEquity] = useState('');
    const [counterValuation, setCounterValuation] = useState('');
    const [counterConditions, setCounterConditions] = useState('');

    const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:4000';

    const fetchContracts = async () => {
        try {
            const token = localStorage.getItem('innova_token');
            const res = await fetch(`${API_BASE}/api/contract`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setContracts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleRespond = async (id: string, action: 'accept' | 'reject' | 'counter', data?: any) => {
        try {
            const token = localStorage.getItem('innova_token');
            const body = { action, ...data };

            const res = await fetch(`${API_BASE}/api/contract/${id}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert(`Proposal ${action}ed successfully!`);
                setIsCounterOpen(false);
                fetchContracts();
            } else {
                const err = await res.json();
                alert(`Failed: ${err.message}`);
            }
        } catch (err) {
            alert('Error responding to proposal');
        }
    };

    const openCounterModal = (contract: Contract) => {
        setSelectedContract(contract);
        setCounterAmount(contract.amount.toString());
        setCounterEquity(contract.equity.toString());
        setCounterValuation(contract.valuation.toString());
        setCounterConditions(contract.conditions);
        setIsCounterOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Proposals</h1>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : contracts.length === 0 ? (
                    <p className="text-gray-500">No proposals found.</p>
                ) : (
                    <div className="grid gap-6">
                        {contracts.map(contract => (
                            <div key={contract._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Investor: {contract.investorId?.name || 'Unknown'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                            Contract: {contract.contractAddress.substring(0, 10)}...
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${contract.status === 'funded' ? 'bg-green-100 text-green-800' :
                                            contract.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                                contract.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {contract.status.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Amount</p>
                                        <p className="font-semibold text-lg">${contract.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Equity</p>
                                        <p className="font-semibold text-lg">{contract.equity}%</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Valuation</p>
                                        <p className="font-semibold text-lg">${contract.valuation?.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Date</p>
                                        <p className="font-semibold text-lg">{new Date(contract.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conditions:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        "{contract.conditions}"
                                    </p>
                                </div>

                                {contract.status === 'pending_startup_review' && (
                                    <div className="flex gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <button
                                            onClick={() => handleRespond(contract._id, 'accept')}
                                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="h-5 w-5" /> Accept
                                        </button>
                                        <button
                                            onClick={() => openCounterModal(contract)}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="h-5 w-5" /> Counter
                                        </button>
                                        <button
                                            onClick={() => handleRespond(contract._id, 'reject')}
                                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="h-5 w-5" /> Reject
                                        </button>
                                    </div>
                                )}

                                {contract.status === 'pending_investor_review' && (
                                    <div className="text-center text-gray-500 italic pt-2">
                                        Waiting for investor response...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Counter Offer Modal */}
                {isCounterOpen && selectedContract && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Counter Offer</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                                    <input type="number" value={counterAmount} onChange={e => setCounterAmount(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Equity (%)</label>
                                    <input type="number" value={counterEquity} onChange={e => setCounterEquity(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valuation ($)</label>
                                    <input type="number" value={counterValuation} onChange={e => setCounterValuation(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conditions</label>
                                    <textarea value={counterConditions} onChange={e => setCounterConditions(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" rows={3} />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setIsCounterOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                                    <button
                                        onClick={() => handleRespond(selectedContract._id, 'counter', {
                                            amount: Number(counterAmount),
                                            equity: Number(counterEquity),
                                            valuation: Number(counterValuation),
                                            conditions: counterConditions
                                        })}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Send Counter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StartupProposalsPage;
