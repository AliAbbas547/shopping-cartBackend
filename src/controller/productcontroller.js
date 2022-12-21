const ProductsModel = require("../models/ProductModel");
const aws = require("../aws/aws");
const errorHandler = require("../errorHandling/errorHandling")

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
    let availableSizes = req.body.availableSizes
    let availableS = availableSizes.split(",").map(x => x.trim())
    data['availableSizes'] = availableS
    data["productImage"] = uploadedFileURL;
    const productsData = await ProductsModel.create(data);
    return res.status(201).send({ status: true, data: productsData });
  } catch (err) {
    return  errorHandler(err, res);
  }
};

module.exports = { createProducts };
