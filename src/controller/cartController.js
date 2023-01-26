const cartModel = require("../models/cartModel");
const errorHandler = require("../errorHandling/errorHandling");
const ProductsModel = require("../models/productModel");

var { ObjectId } = require("mongodb");

const createCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    let data = req.body;
    let { productId, cartId, quantity } = data;
    quantity = Number(quantity)
    if (!quantity) {
      quantity = 1;
    }
    if(quantity < 0 || typeof(quantity) != "number" )
    {
      return res.status(400).send({ status : false , msg : "quantity must be positive number"})
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
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId.toString() == productId) {
          items[i].quantity += quantity;
          flag = 1;
        }
      }
      if (flag == 1) {
        price = quantity * price + totalPrice;
        let data = {
          totalPrice: price,
          items: items,
          totalItems: items.length,
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
    let data = req.body;
    let { productId, cartId, removeProduct } = data;
    let x  = removeProduct
    if(!( x == "0" || x == "1"))
    {
      return res.status(400).send({ status :false , msg : "please provide valid data at removeProduct "})
    }
    let ProductData = await ProductsModel.findOne({ _id: productId });
    let price = ProductData.price;

    let cartData = await cartModel.findOne({userId:userId });
    let items = cartData.items;
   
    let totalPrice = cartData.totalPrice;

    if (removeProduct == 1) {
      let NewQuantity;
      let flag = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId.toString() == productId) {
          NewQuantity = items[i].quantity;
        
          flag = 1;
          if (items[i].quantity != 1) {
            items[i].quantity =items[i].quantity -1;
          } else if(items[i].quantity == 1){
            items.splice(i, 1);
          }
        }
      }
      if (flag == 0) {
        return res
          .status(400)
          .send({
            status: false,
            message: "productId is not present in the cart",
          });
      }

      if (NewQuantity != 1) {
        totalPrice = totalPrice - price;
        let data = {
          items: items,
          totalPrice: totalPrice,
          totalItems:items.length
        };

        let updateCart = await cartModel.findOneAndUpdate(
          { userId: userId},
          { $set: data },
          { new: true }
        );
        return res.status(200).send({ status: true, data: updateCart });
      } else if(NewQuantity == 1){
        totalPrice= totalPrice- price
       
        let updateCart = await cartModel.findOneAndUpdate(
          { _id: cartId },
          { $set: { items: items,totalItems:items.length,totalPrice:totalPrice } },
          { new: true }
        );
        return res.status(200).send({ status: true, data: updateCart });
      }
    } else if(removeProduct == 0) {
      let flag = 0;
      let quantity1;
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId.toString() == productId) {
          quantity1 = items[i].quantity;
          items.splice(i, 1);
          flag = 1;
        }
      }
      if (flag == 1) {
        totalPrice = totalPrice -( price * quantity1);
        let data = {
          items: items,
          totalPrice: totalPrice,
          totalItems: items.length
        };

        let updateCart = await cartModel.findOneAndUpdate(
          {userId:userId },
          { $set: data },
          { new: true }
        );
        return res.status(200).send({ status: true, data: updateCart });
      } else {
        return res
          .status(400)
          .send({ status: false, message: " your request is not correct" });
      }
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};
const getCartData = async function (req, res) {
  try {
    let userId = req.params.userId;

    let cartData = await cartModel
      .findOne({ userId: userId })
      .populate("items.productId", { title: 1, price: 1, productImage: 1 ,description : 1 });
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
    let cartData = await cartModel.findOne({ userId: userId });
    if (cartData == null) {
      return res
        .status(404)
        .send({ status: false, message: "this user has no any cart details" });
    }
    let items = cartData.items; 
    let newItems = items.splice(0, items.length);
    let data = {
      items: items,
      totalPrice: 0,
      totalItems: 0,
    };
    let deleteCartData = await cartModel.findOneAndUpdate(
      { userId: userId },
      { $set: data },
      { new: true }
    );
    return res
      .status(204)
      .send({ status: true, message: "cart deleted successfully"});
  } catch (err) {
    return errorHandler(err, res);
  }
};
module.exports = { createCart, updateCart, getCartData, deleteCartData };
