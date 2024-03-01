const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
    Date:String,
    Cartno:String,
    Name:String,
    Phone:String,
    Email:String,
    
    OrderId:String,
    Amount:String,
})
const CustomerModel = mongoose.model(" History",HistorySchema)

module.exports = CustomerModel;