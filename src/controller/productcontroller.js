const ProductsModel = require("../models/productModel");
const aws = require("../aws/aws");
const errorHandler = require("../errorHandling/errorHandling");

const createProducts = async function (req, res) {
  try {
    let uploadedFileURL;
    let files = req.files;
    if (files && files.length > 0) {
      uploadedFileURL = await aws.uploadFile(files[0]);
    } else {
      return res.status(400).send({ msg: "No file found" });
    }
    let data = req.body;
    let availableSizes = req.body.availableSizes;
    let availableS = availableSizes.split(",").map((x) => x.trim());
    data["availableSizes"] = availableS;
    data["productImage"] = uploadedFileURL;
    const productsData = await ProductsModel.create(data);
    return res.status(201).send({ status: true, data: productsData });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getProductsData = async function (req, res) {
  try {
    let query = req.query;

    let { name, size, priceGreaterThan, priceLessThan, priceSort } = query;
    let QueryValue = { isDeleted: false };

    if (name) {
      QueryValue["title"] = { $regex: name, $options: "i" };
    }
    if (size) {
      size = size.split(",");
      size = size.map((x) => x.toUpperCase());
      QueryValue["availableSizes"] = { $in: size };
    }
    if (priceGreaterThan && priceLessThan) {
      QueryValue["price"] = { $gt: priceGreaterThan, $lt: priceLessThan };
    } else if (priceGreaterThan) {
      QueryValue["price"] = { $gt: priceGreaterThan };
    } else if (priceLessThan) {
      QueryValue["price"] = { $lt: priceLessThan };
    }

    let data = await ProductsModel.find(QueryValue).sort({ price: priceSort });
    if (data.length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "no any product is present on the basis of your query ",
        });
    }
    return res.status(200).send({ status: true, data: data });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const updateProductData = async function (req, res) {
  try {
    let productId = req.params.productId;
    let alreadyDeleted = await ProductsModel.findOne({
      _id: productId,
      isDeleted: true,
    });
    if (alreadyDeleted["isDeleted"] == true) {
      res.status(400).send({ status: false, msg: "this product is  deleted" });
    }
    let dataToUpdate = req.body;
    let { availableSizes, ...data } = dataToUpdate;
    let data1 = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        $addToSet: { availableSizes: availableSizes },
        $set: { data },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).send({ status: true, data: data1 });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const deleteProductData = async function (req, res) {
  try {
    let productId = req.params.productId;
    let alreadyDeleted = await ProductsModel.findOne({
      _id: productId,
      isDeleted: true,
    });
    if (alreadyDeleted["isDeleted"] == true) {
      res
        .status(400)
        .send({ status: false, msg: "this product is already deleted" });
    }
    let data = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res.status(200).send({ status: true, data: data });
  } catch (err) {
    return errorHandler(err, res);
  }
};
module.exports = {
  createProducts,
  getProductsData,
  updateProductData,
  deleteProductData,
};
