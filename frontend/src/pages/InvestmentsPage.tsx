import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { web3Service } from '../services/Web3Service';

interface Contract {
    _id: string;
    startupId: { _id: string; companyName: string };
    amount: number;
    equity: number;
    valuation: number;
    conditions: string;
    status: string;
    contractAddress: string;
    createdAt: string;
}

const InvestmentsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState('');
    const [isReleasing, setIsReleasing] = useState(false);

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

    const connectWallet = async () => {
        try {
            const address = await web3Service.connectWallet();
            setWalletAddress(address);
        } catch (err: any) {
            alert('Failed to connect wallet: ' + err.message);
        }
    };

    const handleReleaseFunds = async (contract: Contract) => {
        if (!walletAddress) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            setIsReleasing(true);
            // 1. Trigger Blockchain Transaction
            // Using a mock startup address for demo if contract doesn't have one
            const startupEthAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
            await web3Service.releaseFunds(startupEthAddress, contract.amount);

            // 2. Update Backend Status
            const token = localStorage.getItem('innova_token');
            const res = await fetch(`${API_BASE}/api/contract/${contract._id}/release`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Funds released successfully via Blockchain!');
                fetchContracts(); // Refresh list
            }
        } catch (err: any) {
            console.error(err);
            alert('Transaction failed: ' + err.message);
        } finally {
            setIsReleasing(false);
        }
    };

    const handleRespond = async (id: string, action: 'accept' | 'reject') => {
        try {
            const token = localStorage.getItem('innova_token');
            const res = await fetch(`${API_BASE}/api/contract/${id}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                alert(`Offer ${action}ed!`);
                fetchContracts();
            }
        } catch (err) {
            alert('Error responding');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 dark:text-gray-400">
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Investments</h1>
                    </div>

                    {!walletAddress ? (
                        <button
                            onClick={connectWallet}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors"
                        >
                            <Wallet className="h-5 w-5" /> Connect Wallet
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-mono text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                        </div>
                    )}
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : contracts.length === 0 ? (
                    <p className="text-gray-500">No investment contracts found.</p>
                ) : (
                    <div className="grid gap-6">
                        {contracts.map(contract => (
                            <div key={contract._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {contract.startupId?.companyName || 'Unknown Startup'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                            Contract: {contract.contractAddress.substring(0, 10)}...
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${contract.status === 'funded'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {contract.status === 'funded' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        {contract.status.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Amount</p>
                                        <p className="font-semibold text-lg">${contract.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <p className="text-xs text-gray-500 uppercase">Equity</p>
                                        <p className="font-semibold text-lg">{contract.equity}%</p>
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

                                {contract.status === 'accepted' && (
                                    <button
                                        onClick={() => handleReleaseFunds(contract)}
                                        disabled={isReleasing}
                                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isReleasing ? (
                                            <>Processing Blockchain Tx...</>
                                        ) : (
                                            <><CheckCircle className="h-5 w-5" /> Release Funds (ETH)</>
                                        )}
                                    </button>
                                )}

                                {contract.status === 'pending_investor_review' && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3 font-medium">
                                            Startup has countered your offer. Review changes above.
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRespond(contract._id, 'accept')}
                                                className="flex-1 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-bold"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(contract._id, 'reject')}
                                                className="flex-1 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-bold"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {contract.status === 'pending_startup_review' && (
                                    <div className="text-center text-gray-500 italic">
                                        Waiting for startup response...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentsPage;
