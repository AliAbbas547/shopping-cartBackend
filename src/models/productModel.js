const mongoose = require("mongoose")

const ProductsSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the title"],
      },
    description: {
        type: String,
        required: [true, "Please provide the description"],
      },
    price: {
        type: String,
        required: [true, "Please provide the price"],
      },
    currencyId: {
        type: String,
        required: [true, "Please provide the currencyId"],
      default:"INR"},
    currencyFormat: {
        type: String,
        required: [true, "Please provide the currencyFormat"],
      },
    isFreeShipping: {type:Boolean,
         default: false},
    productImage: {
        type: String,
        required: [true, "Please provide the productImage"],
      }, 
    style: String,
    availableSizes: {
            type: [String],
            required: [true, "Please provide the availableSizes"],
            enum:["S", "XS","M","X", "L","XXL", "XL"],
            message : "Please enter valid Size"
     },
    installments: Number,
    deletedAt:{
    type:Date,
    default:null}, 
    isDeleted: {type:Boolean, default: false},
 
},{timestamps:true});

module.exports= mongoose.model("Product",ProductsSchema)