const cartModel = require("../models/cartModel");
const orderModel = require("../models/oderModel");
const errorHandler = require("../errorHandling/errorHandling");
const oderModel = require("../models/oderModel");
const ProductsModel = require("../models/productModel");

const createOder = async function (req, res) {
  try {
    let userId1 = req.params.userId;
    let data = req.body;
    let cartId = req.body.cartId;
    let t1 = { userId: 1, items: 1, totalPrice: 1, totalItems: 1,_id : 0 };
    let cartData = await cartModel
      .findOne({ userId: userId1 })
      .select(t1)
      .lean();
    if (cartData == null) {
      return res
        .status(400)
        .send({ status: false, message: "this user has no  any cartdata" });
    }
    let items = cartData.items;
    let totalQuantity = 0;
    for (let i = 0; i < items.length; i++) {
      totalQuantity += items[i].quantity;
    }
    cartData["totalQuantity"] = totalQuantity;
    let createOrder = await orderModel.create(cartData);
    return res.status(201).send({ status: true, data: createOrder });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const updateOrder = async function (req, res) {
  try {
    let orderId = req.body.orderId;
    let userId = req.params.userId;
    let oddata = await orderModel.findOne({
      userId: userId,
    });

    if (oddata == null) {
      return res
        .status(404)
        .send({ status: false, message: "your request is not correct" });
    }
    if (orderId != oddata._id) {
      return res.status(400).send({ status: false, msg: "invalid orderId " });
    }

    let check = oddata.cancellable;
    if (check == true) {
      let updatedData = await orderModel.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            status: "cancled",
            isDeleted: true,
            deletedAt: Date.now(),
          },
        },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "updated Successfully",
        data: updatedData,
      });
    } else {
    
      return res.status(400).send({
        status: false,
        message: "order can't be cancelled",
        
      });
    }

  } catch (err) {
    return errorHandler(err, res);
  }
};

const getoder = async function(req,res){
  try{
    let oderId = req.params.oderId;
    const OderData = await oderModel.findById(oderId).populate("items.productId", { title: 1, price: 1, productImage: 1 ,description : 1 })
    res.status(200).send({ status : false , data : OderData })
  }catch(err){
    return errorHandler(err, res);
  }
}
module.exports = { createOder, updateOrder,getoder };
