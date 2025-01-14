const {Transaction} = require('../../models/transaction');
exports.createTransaction = async (data, _id) =>{
    const {name , description, date, category , subcategory, amount} = data;
    const transactionData = new Transaction({
        owner: _id,
        title : name,
        transaction_type : category,
        category : subcategory,
        amount : amount,
        date : date,
        description : description
    }); 
    return transactionData;    
}