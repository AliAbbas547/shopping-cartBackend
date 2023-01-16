//<----------------------< Importing : Packages >---------------------->//
const mongoose = require("mongoose");
const validation = require('../validation/validation')
//<----------------------< Create : UserSchema >----------------------->//
const UserSchema = new mongoose.Schema(
  {
    name: { 
        type: String,
        trim : true, 
        // required: [true, "Please provide the first name"],
        // validate: [ validation.isValidName , "please provide a valid last name"]
    },
    // lname: { 
    //     type: String, 
    //     required: [true, "Please provide the last name"],
    //     trim : true,
    //     validate: [ validation.isValidName , "please provide a valid last name"]
    // },

    email:  {
        type: String,
        required: [true, "Please provide your E-mail"],
        unique: true,
        trim : true,
        validate: [ validation.isValidEmailId , "please provide a valid email id"]
      },

    // profileImage: {
    //      type: String,
    //      required: [true, "Please provide your profileImage "], 
    //      trim: true },

    phone: {
        type: String,
        required: [true, "Please provide your phone number"],
        unique: true,
        trim : true,
        validate: [
          validation.isValidMobile,
          "Please provide a valid phone number",
        ],
      },

    password:  {
        type: String,
        required: [true, "Please provide the password"],
      },

    address: {
        type : Object, 
      shipping: {
        street: { type: String,
                required: [true, "Please provide the street address"],
                trim: true, },
        city: { type: String,
                required: [true, "Please provide the city address"],
                trim: true, },
        pincode: { type: String,
                required: [true, "Please provide the pincode"],
                trim: true,
                validate: [
                  validation.isValidPincode,
                  "Please provide a valid Pincode",
                ], },
      },
      billing: {
        street: { type: String,
                required: [true, "Please provide the street address"],
                trim: true, },
        city: { type: String,
                required: [true, "Please provide the city address"],
                trim: true, },
        pincode: { type: String,
                required: [true, "Please provide the pincode"],
                trim: true,
                validate: [
                  validation.isValidPincode,
                  "Please provide a valid Pincode",
                ], },
      },
    },
  },

  { timestamps: true }
);

//<----------------------< Exports : UserModel >----------------------->//
module.exports = mongoose.model("user", UserSchema);
