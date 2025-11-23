import React, { useState } from 'react';
import { X, DollarSign, Percent, FileText } from 'lucide-react';

interface InvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    companyName: string;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, onSubmit, companyName }) => {
    const [amount, setAmount] = useState('');
    const [equity, setEquity] = useState('');
    const [valuation, setValuation] = useState('');
    const [conditions, setConditions] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ amount: Number(amount), equity: Number(equity), valuation: Number(valuation), conditions });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Invest in {companyName}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Investment Amount ($)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="10000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Equity Requested (%)
                        </label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                required
                                step="0.1"
                                value={equity}
                                onChange={(e) => setEquity(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="5.0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Proposed Valuation ($)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="number"
                                required
                                value={valuation}
                                onChange={(e) => setValuation(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="1000000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Conditions / Milestones
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <textarea
                                required
                                value={conditions}
                                onChange={(e) => setConditions(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={3}
                                placeholder="e.g. Funds released upon completion of MVP..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Create Proposal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InvestmentModal;
