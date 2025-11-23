const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
    amount: { type: Number, required: true },
    equity: { type: Number, required: true }, // Percentage
    valuation: { type: Number, required: true }, // Proposed Valuation
    conditions: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending_startup_review', 'pending_investor_review', 'accepted', 'rejected', 'funded'],
        default: 'pending_startup_review'
    },
    contractAddress: { type: String }, // Mock address
    history: [{
        action: { type: String, enum: ['created', 'countered', 'accepted', 'rejected'] },
        by: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID
        role: { type: String, enum: ['investor', 'startup'] },
        amount: Number,
        equity: Number,
        valuation: Number,
        conditions: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contract', ContractSchema);
