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

exports.getProductsData = async function (req, res) {
  try {
    const queryParams = req.query;

    let { size, name, priceGreaterThan, priceLessThan, priceSort } =
      queryParams;

    const filterQuery = { isDeleted: false };
    if (size) {
      size = size.toUpperCase().split(",");
      if (!size)
        return res.status(400).send({ status: false, msg: "provide size" });
      filterQuery["availableSizes"] = { $in: size };
    }

    if (priceGreaterThan) {
      // if (!valid.isValidPrice(priceGreaterThan))
      //     return res.status(400).send({ status: false, msg: "provide priceGreaterThan in numeric" })
      filterQuery["price"] = { $gt: priceGreaterThan };
    }

    if (priceLessThan) {
      // if (!valid.isValidPrice(priceLessThan))
      //     return res.status(400).send({ status: false, msg: "provide priceLessThan in numeric" })
      filterQuery["price"] = { $lt: priceLessThan };
    }

    // if (valid.isValid(name)) {
    //     filterQuery['title'] = { $regex: name, $options: "i" };
    // };

    // validation of priceSort
    if (priceSort) {
      if (!(priceSort == 1 || priceSort == -1)) {
        return res.status(400).send({
          status: false,
          message: "Price sort only takes 1 or -1 as a value",
        });
      }

      let filterProduct = await productModel
        .find(filterQuery)
        .sort({ price: priceSort });
      if (Object.keys(filterProduct).length == 0) {
        return res.status(400).send({
          status: false,
          message: "No products found with this query",
        });
      }
      return res
        .status(200)
        .send({ status: true, message: "Success", data: filterProduct });
    }
    const products = await productModel.find(filterQuery).sort({ price: 1 });
    if (Object.keys(products).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Product not found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: products });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
exports.updateProductData = async function (req, res) {
  try {
    let productId = req.params.productId;
    let dataToUpdate = req.body;
    let { availableSizes, ...data } = dataToUpdate;
    let data1 = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        $addToSet: { availableSizes: availableSizes },
        $set: { data },
      },
      { new: true, upsert: true }
    );

    return res.status(200).send({ status: true, data: data1 });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
exports.deleteProductData = async function (req, res) {
  try {
    let productId = req.params.productId;

    let data = await ProductsModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res.status(200).send({ status: true, data: data });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = { createProducts };
