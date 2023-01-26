const ProductsModel = require("../models/productModel");
const aws = require("../aws/aws");
const errorHandler = require("../errorHandling/errorHandling");
const validation = require("../validation/validation");

const createProducts = async function (req, res) {
  try {
    let data = req.body;
    let uploadedFileURL;
    let files = req.files;
    if (files && files.length > 0) {
      uploadedFileURL = await aws.uploadFile(files[0]);
    } else {
      return res.status(400).send({ msg: "No file found" });
    }
    let availableSizes = req.body.availableSizes;
    if (availableSizes) {
      let availableS = availableSizes.split(",").map((x) => x.trim());
      data["availableSizes"] = availableS;
    }
    data["productImage"] = uploadedFileURL;
    const productsData = await ProductsModel.create(data);
    return res.status(201).send({ status: true, data: productsData });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const getProductsDataById = async function (req, res) {
  try {
    let productId = req.params.productId;
    if (!validation.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "productId is not correct" });
    }
    let data = await ProductsModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (data == null) {
      return res.status(400).send({
        status: false,
        message: "no any data is present with this productId",
      });
    }
    return res.status(200).send({ status: true, data: data });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
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
      QueryValue["price"] = { $gte: priceGreaterThan, $lte: priceLessThan };
    } else if (priceGreaterThan) {
      QueryValue["price"] = { $gte: priceGreaterThan };
    } else if (priceLessThan) {
      QueryValue["price"] = { $lte: priceLessThan };
    }

    let data = await ProductsModel.find(QueryValue).sort({ price: priceSort });
    if (data.length == 0) {
      return res.status(400).send({
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
    if (alreadyDeleted != null) {
      return res
        .status(400)
        .send({ status: false, msg: "can not change deleted product" });
    }
    let dataToUpdate = req.body;
    if (Object.keys(dataToUpdate).length == 0)
      return res.status(400).send({
        status: false,
        message: "Pls provide data in Body",
      });
    let { availableSizes, ...data } = dataToUpdate;
    if(availableSizes){
    availableSizes = availableSizes.split(",").map((x) => x.trim()); }
    let data1 = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        $addToSet: { availableSizes: availableSizes },
        $set: { ...data },  
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
    if (!validation.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Provide Valid Project ID" });
    }
    let alreadyDeleted = await ProductsModel.findOne({
      _id: productId,
    });
    if(alreadyDeleted == null)
    {
      return res
      .status(404)
      .send({ status: false, msg: "this productId is not exist in Database" });
    }
    if (alreadyDeleted['isDeleted'] == true) {
      return res
        .status(404)
        .send({ status: false, msg: "this product is already deleted" });
    }
    let data = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, data: "product deleted Succesfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const ProductData = async function(req,res){
  try{
    const gender = req.params.gender
    const category = req.query.category
    let query = {}
    if(gender  && gender != 'gender')
    {
      query['gender'] = gender
    }
    if(category)
    {
      query['category'] = category
    }
    const data = await ProductsModel.find(query).sort({ createdAt: -1 })
    return res.status(200).send({ status : true , data : data})
  }catch(err){
    errorHandler(err,res)
  }
}
module.exports = {
  createProducts,
  getProductsData,
  updateProductData,
  deleteProductData,
  getProductsDataById,
  ProductData
};
