const Contract = require('../models/Contract');
const Startup = require('../models/Startup');

exports.create = async (req, res) => {
    try {
        const { startupId, amount, equity, valuation, conditions } = req.body;
        const investorId = req.user.userId;

        const contract = new Contract({
            investorId,
            startupId,
            amount,
            equity,
            valuation,
            conditions,
            status: 'pending_startup_review',
            contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
            history: [{
                action: 'created',
                by: investorId,
                role: 'investor',
                amount,
                equity,
                valuation,
                conditions
            }]
        });

        await contract.save();
        res.status(201).json(contract);
    } catch (err) {
        console.error('[CONTRACT][CREATE] error', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.list = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        let query = {};
        if (role === 'investor') {
            query = { investorId: userId };
        } else if (role === 'startup') {
            query = { startupId: userId };
        }

        const contracts = await Contract.find(query)
            .populate('startupId', 'companyName')
            .populate('investorId', 'name')
            .sort({ createdAt: -1 });
        res.json(contracts);
    } catch (err) {
        console.error('[CONTRACT][LIST] error', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.respond = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, amount, equity, valuation, conditions } = req.body; // action: 'accept', 'reject', 'counter'
        const userId = req.user.userId;
        const role = req.user.role;

        const contract = await Contract.findById(id);
        if (!contract) return res.status(404).json({ message: 'Contract not found' });

        // Verify permission
        if (role === 'investor' && contract.investorId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });
        if (role === 'startup' && contract.startupId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

        // State validation (simplified)
        if (contract.status === 'accepted' || contract.status === 'funded' || contract.status === 'rejected') {
            return res.status(400).json({ message: 'Contract already finalized' });
        }

        if (action === 'accept') {
            contract.status = 'accepted';
            contract.history.push({ action: 'accepted', by: userId, role });
        } else if (action === 'reject') {
            contract.status = 'rejected';
            contract.history.push({ action: 'rejected', by: userId, role });
        } else if (action === 'counter') {
            // Update terms
            if (amount) contract.amount = amount;
            if (equity) contract.equity = equity;
            if (valuation) contract.valuation = valuation;
            if (conditions) contract.conditions = conditions;

            // Set status to pending other party
            contract.status = role === 'investor' ? 'pending_startup_review' : 'pending_investor_review';

            contract.history.push({
                action: 'countered',
                by: userId,
                role,
                amount: contract.amount,
                equity: contract.equity,
                valuation: contract.valuation,
                conditions: contract.conditions
            });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await contract.save();
        res.json(contract);

    } catch (err) {
        console.error('[CONTRACT][RESPOND] error', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.releaseFunds = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id);

        if (!contract) return res.status(404).json({ message: 'Contract not found' });
        if (contract.investorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (contract.status !== 'accepted') {
            return res.status(400).json({ message: 'Contract must be accepted by both parties before releasing funds' });
        }

        contract.status = 'funded';
        await contract.save();

        // Update startup funding amount
        await Startup.findByIdAndUpdate(contract.startupId, {
            $inc: { fundingAmount: contract.amount }
        });

        res.json(contract);
    } catch (err) {
        console.error('[CONTRACT][RELEASE] error', err);
        res.status(500).json({ message: 'Server error' });
    }
};
