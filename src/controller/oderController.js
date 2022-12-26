const cartModel = require("../models/cartModel");
const orderModel = require("../models/oderModel");
const errorHandler =require('../errorHandling/errorHandling')
const createOder = async function (req, res) {
  try {
    let userId1 = req.params.userId;
    let data = req.body;
    let t1 = { userId: 1, items: 1, totalPrice: 1, totalItems: 1, _id: 0 };
    let cartData = await cartModel.findOne({ userId: userId1 })
      .select(t1)
      .lean();
    if (userId1 != cartData.userId) {
      return res.status(400).send({ message: "userId is not correct" });
    }
    let items = cartData.items;

    let notDeleted = [];

    for (let i = 0; i < items.length; i++) {
      let t1 = String(items[i].productId);
      notDeleted.push(t1);
    }
    let check = [];

    for (let i = 0; i < notDeleted.length; i++) {
      let data = await ProductsModel.findOne({
        _id: notDeleted[i],
        isDeleted: false,
      });

      if (data == null) {
        check.push(notDeleted[i]);
        break;
      }
    }

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < check.length; j++) {
        if (check[j] == items[i].productId) {
          items.splice(i, 1);
        }
      }
    }

    let price = 0;
    let totalQuantity = 0;

    for (let i = 0; i < items.length; i++) {
      let data = await ProductsModel.findOne({
        _id: items[i].productId,
        isDeleted: false,
      });
      price += data.price * items[i].quantity;
      totalQuantity += items[i].quantity;
    }

    cartData["totalQuantity"] = totalQuantity;
    cartData["totalPrice"] = price;
    cartData["totalItems"] = items.length;
   

    let createOrder = await orderModel.create(cartData);
    return res.status(201).send({ status: true, data: createOrder });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
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
