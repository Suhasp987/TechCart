const mongoose = require('mongoose');

const TemporaryTableSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  Product: { type: String, required: true },
  Price: { type: String, required: true },
  tag_id:{type:[String],require:true},
  Quantity:{type:Number,require:true}
  
});

const TemporarySchema = new mongoose.Schema({
  cartNumber: { type: String, required: true },
  items: { type: [TemporaryTableSchema], required: true },
});

const TemporaryTableModel = mongoose.model('Temporary', TemporarySchema);

module.exports = TemporaryTableModel;