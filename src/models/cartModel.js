const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: "User",
            required: [true, "Please provide the userId"],
            trim: true
        },
        items: [{
                productId: {
                    type: ObjectId,
                    ref: "Product",
                    required: true,
                    trim: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    trim: true,
                    default : 1
                },
            }],
        totalPrice: {
            type: Number,
            required: [true, "Please provide the totalPrice"],
            trim: true
        },
        totalItems: {
            type: Number,
            required: [true, "Please provide the totalItems"],
            trim: true
        }
    }, { timestamps: true });


module.exports = mongoose.model("Cart", cartSchema);