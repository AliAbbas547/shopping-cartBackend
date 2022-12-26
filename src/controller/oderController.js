const cartModel = require("../models/cartModel");
const orderModel = require("../models/oderModel");
const errorHandler =require('../errorHandling/errorHandling')
const createOder = async function (req, res) {
  try {
    let userId = req.params.userId;
    let data = req.body;
    const cartData = await cartModel
      .findOne({ userId: userId })
      .select({ _id: 0, createdAt: 0, __v: 0, updatedAt: 0 })
      .lean();
    cartData["totalQuantity"] = 0;
    for (let i = 0; i <= cartData["items"].length - 1; i++) {
      cartData["totalQuantity"] =
        cartData["totalQuantity"] + cartData["items"][i].quantity;
    }
    let oderData = { ...cartData, ...data };
    const oder = await orderModel.create(oderData);
    res.status(201).send({ msg: oder });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const updateOrder = async function (req, res) {
  try {
    let orderId  = req.body.orderId;
    let userId = req.params.userId;
    let oddata = await orderModel.findOne({
      userId: userId,
      cancellable: true,
      isDeleted: false,
    });
    if (oddata == null) {
      return res
        .status(404)
        .send({ status: false, message: "your request is not correct" });
    }
    if(orderId != oddata._id)
    {
      res.status(400).send({ status : false , msg : "invalid orderId "})
    }
    let data = {
      status: "cancled",
      isDeleted: true,
      deletedAt: Date.now(),
    };
    let updatedData = await orderModel.findOneAndUpdate(
      { _id: orderId, userId: userId },
      { $set: data },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "updated Successfully",
        data: updatedData,
      });
  } catch (err) {
    return errorHandler(err, res);
  }
};
module.exports = { createOder,updateOrder };
