const mongoose = require("mongoose")
const validation = require('../validation/validation')

const ProductsSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the title"],
        unique : true,
        trim: true,
        validate: [ validation.isValidName , "please provide a valid Title"]
        
      },
    description: {
        type: String,
        required: [true, "Please provide the description"],
        trim: true
      },
    price: {
        type: Number,
        required: [true, "Please provide the price"],
        trim: true
      },
    currencyId: {
        type: String,
        required: [true, "Please provide the currencyId"],
      default:"INR",
      trim: true},
    currencyFormat: {
        type: String,
        required: [true, "Please provide the currencyFormat"],
        trim: true
      },
    isFreeShipping: {
         type:Boolean,
         default: false,
         trim: true},
    productImage: {
        type: String,
        required: [true, "Please provide the productImage"],
        trim: true
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