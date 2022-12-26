const cartModel = require("../models/cartModel");
const errorHandler = require("../errorHandling/errorHandling");
const ProductsModel = require("../models/productModel");

var { ObjectId } = require("mongodb");
const productModel = require("../models/productModel");

const createCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    console.log("kjdfkljdsf")
    let data = req.body;
    let { productId, cartId, quantity } = data;
    if (!quantity) {
      quantity = 1;
    }
    let ProductData = await ProductsModel.findOne({ _id: productId });
    if (ProductData == null) {
      return res
        .status(400)
        .send({ status: false, message: "productId is not correct" }); 
    }
    let price = ProductData.price;

    let cartData = await cartModel.findOne({ userId: userId });

    if (cartData == null) {
      let data = {
        userId: userId,
        items: [{ productId: productId, quantity: quantity }],
        totalPrice: (price * quantity).toFixed(2), 
        totalItems: 1,
      };
      let createCart = await cartModel.create(data);
      res.status(201).send({ status: true, data: createCart });
    } else {
      let items = cartData.items;
      let totalPrice = cartData.totalPrice;
      let totalItems = cartData.totalItems; 

      let flag = 0;
      // let NewQuantity = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId.toString() == productId) {
          items[i].quantity += quantity;
          // NewQuantity = items[i].quantity
          flag = 1;
        }
      }
      if (flag == 1) {
        price = quantity * price + totalPrice;
        let data = {
          totalPrice: price,
          items: items,
          totalItems : items.length
        };
        let updateCart = await cartModel.findOneAndUpdate(
          { userId: userId },
          { $set: data },
          { new: true }
        );
        return res.status(201).send({ status: true, data: updateCart });
      } else if (flag == 0) {
        items.push({ productId: productId, quantity: quantity });
        price = price * quantity + totalPrice;
        totalItems = totalItems + 1;
        let data = {
          items: items,
          totalPrice: price,
          totalItems: totalItems,
        };
        let updateCart = await cartModel.findOneAndUpdate(
          { userId: userId },
          { $set: data },
          { new: true }
        );
        return res.status(201).send({ status: true, data: updateCart });
      }
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

const updateCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    let productId = req.body.productId;
    let removeProduct = req.body.removeProduct
    let cardData = await cartModel.findOne({ userId: userId }).lean();
    if (cardData == null) {
      res.status.send({
        status: false,
        msg: "there is no cart with this user id",
      });
    }
    let updatedData = {};
    let productData = await productModel.findOne({ productId: productId });
    let array = cardData["items"];
    for (let i = 0; i <= array.length - 1; i++) {
      if (productId == array[i].productId) {
        array[i].quantity = array[i].quantity - 1;
        updatedData["items"] = array;
        updatedData["totalPrice"] =
        Number(cardData["totalPrice"]) - Number(productData["price"]);
        if (array[i].quantity == 0 || removeProduct == 0) {
          array.splice(i, 1);
        }
      }
    }
    updatedData["totalItems"] = array.length;
    let finalUpdate = await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: updatedData },
      { new: true }
    );
    res.status(200).send({ msg: finalUpdate });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const getCartData = async function (req, res) {
  try {
    let userId = req.params.userId;

    let cartData = await cartModel
      .findOne({ userId: userId })
      .populate("items.productId", { title: 1, price: 1, productImage: 1 });
    if (cartData == null) {
      return res
        .status(404)
        .send({ status: false, message: "this user has no any cart details" });
    }
    return res.status(200).send({ status: true, data: cartData });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const deleteCartData = async function (req, res) {
  try {
    let userId = req.params.userId;
    let cartData = await CartModel.findOne({ userId: userId });
    console.log(cartData);
    if (cartData == null) {
      return res
        .status(404)
        .send({ status: false, message: "this user has no any cart details" });
    }
    let items = cartData.items;
    console.log(items);
    let newItems = items.splice(0, items.length);
    console.log(items);

    let data = {
      items: items,
      totalPrice: 0,
      totalItems: 0,
    };

    let deleteCartData = await CartModel.findOneAndUpdate(
      { userId: userId },
      { $set: data },
      { new: true }
    );

    return res
      .status(204)
      .send({ status: true, message: "cart deleted successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};
module.exports = { createCart, updateCart, getCartData, deleteCartData };
