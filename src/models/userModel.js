//<----------------------< Importing : Packages >---------------------->//
const mongoose = require("mongoose");
const validator = require("validator");
//<----------------------< Create : UserSchema >----------------------->//
const UserSchema = new mongoose.Schema(
  {
    fname: { 
        type: String, 
        required: [true, "Please provide the first name"],
        trim : true,
        validate: {
                validator: function (val) {
                  if (typeof val === "undefined") return false;
                  if (typeof val != "string" && val.trim().length === 0) return false;
                  const regex = /^[a-z/\s/A-Z]{3,100}$/;
                  return regex.test(String(val));
                },
                message: "Name can only contain letters",
              }
    },
    lname: { 
        type: String, 
        required: [true, "Please provide the last name"],
        trim : true,
        validate: {
                validator: function (val) {
                  if (typeof val === "undefined") return false;
                  if (typeof val != "string" && val.trim().length === 0) return false;
                  const regex = /^[a-z/\s/A-Z]{3,100}$/;
                  return regex.test(String(val));
                },
                message: "Name can only contain letters",
              }
    },

    email:  {
        type: String,
        required: [true, "Please provide your E-mail"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid E-mail ID"],
      },

    profileImage: {
         type: String,
        required: [true, "Please provide your phone number"], 
         trim: true },

    phone: {
        type: String,
        required: [true, "Please provide your phone number"],
        unique: true,
        validate: [
          validator.isMobilePhone,
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
                trim: true, },
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
                trim: true, },
      },
    },
  },

  { timestamps: true }
);

//<----------------------< Exports : UserModel >----------------------->//
module.exports = mongoose.model("UserModel", UserSchema);
