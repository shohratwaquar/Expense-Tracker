const model = require('../models/transaction');
const Transaction = model.Transaction;
const {createTransaction} = require('../services/transactions/createtransaction.js')
exports.addTransactions = async (req, res) =>{
    const transactionData = await createTransaction(req.body , req.user._id);
    await transactionData.save();
    res.status(200).json({message : 'Transaction added '});
}

exports.getTransactions = async (req, res) => {
    const { _id } = req.user;

    try {
        const transactions = await Transaction.find({ owner: _id })
            .sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
};


exports.getTransaction = async (req, res) =>{
    const {id} =  req.params;
    try{
        const transaction = await Transaction.findOne({ _id : {$eq : id}});
        if(transaction){
            return res.status(200).json(transaction);
        }else{
            return res.status(400).json({message : "failed to get the transaction"});
        }
    }catch(err){
        console.log("Error occured while loading the transaction");
        
    }
}

exports.updateTransaction = async (req, res) =>{
    const {id} = req.params;
   try{
    await Transaction.findByIdAndUpdate(id, req.body,{new : true});
    return res.status(200).json({message : "Updated the transaction"});
   }catch(err){
    console.log(err);
    }
return res.status(400).json({message : "Internal server error"});
}

exports.deleteTransaction = async (req, res)=>{
    try{
        const {id} = req.params;
        await Transaction.deleteOne({_id : {$eq : id}});
        return res.status(200).json({message : "Transaction deleted successfully"});
    }catch(err){
        console.log(err);
        console.log("Failed to delete the element");
    }
    return res.status(400).json({message : "Failed to delete the transaction"});
}

exports.getTransactionsFiltered = async (req, res) =>{
    const {date , category , subcategory } = req.body;
    let query = {};
    if(date){
        const start_date = new Date(date + '-01');
        const end_date = new Date(date + '-31');
        query.date = {$gte: start_date , $lte : end_date};
    }
    if(category) {
        query.transaction_type = category;
    }
    if(subcategory){
        query.category = subcategory;
    }
    query.owner = req.user._id;
    try {
        const transactions = await Transaction.find(query);
        res.status(200).json(transactions)
    } catch (error) {
        console.error("transaction fetching exception ",error)
    }
} 