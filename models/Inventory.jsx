const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    product_id:String,
    Product:String,
    Price:String,
    Discount:String,
})
const CustomerModel = mongoose.model("Inventory",InventorySchema)

module.exports = CustomerModel;