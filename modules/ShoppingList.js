const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
   name:{
       type: String,
       unique: true
   },
   user_id:{
       type: String,
   },
   date:{
       type: Date,
       required: true
   },
   product_list:[{}]
})

const ShoppingList = mongoose.model('shopping', ShoppingListSchema);

module.exports = ShoppingList;