const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
   name:{
       type: String,
       unique: true
   },
   user_id:{
       type: id,
       required: true,
   },
   date:{
       type: Date,
       required: true
   },
   product_list:{
       type: Product
   }
})

const ShoppingList = mongoose.model('shopping', ShoppingListSchema);

module.exports = ShoppingList;