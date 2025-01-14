const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    owner : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User' // Ensure User model is defined and exported
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transaction_type: {
        type: String,
        required: true,
        default: "income"
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "paisa"
    },
    date: {
        type: Date,
        required: true
    },
});

// Export the model
exports.Transaction = mongoose.model("Transaction", transactionSchema);
