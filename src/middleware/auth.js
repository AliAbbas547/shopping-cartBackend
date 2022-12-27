const jwt = require("jsonwebtoken");
const errorHandler = require("../errorHandling/errorHandling");
const userModel = require("../models/userModel");
const validation = require("../validation/validation");
//<-------------------------------------< Authentication >------------------------------------->//
const authentication = async function (req, res, next) {
  try {
    let bearerHeader = req.headers.authorization;
    let userId = req.params.userId;
    if(!validation.isValidObjectId(userId))
    {
      return res.status(400).send({ status : false , msg : "please enter the valid objectId"})
    }
    if (typeof bearerHeader == "undefined")
      return res.status(400).send({
        status: false,
        message: "Token is missing, please enter a token",
      });

    let bearerToken = bearerHeader.split(" ");

    let token = bearerToken[1];
    let decode = jwt.verify(token, "project-5-Products_Management");
    req.userId = decode.userId;
    next();
  } catch (err) {
    return errorHandler(err, res);
  }
};

const authorization = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    if (userId == req.userId) return next();
    else
      return res
        .status(403)
        .send({ status: false, msg: "you are not authorised" });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};
const checkuserId = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    let validuser = await userModel.findById(userId)
    if(validuser == null)
    {
     return res.status(404).send({ status : false , msg : "user id not found in Database"})
    }
    next()
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};
//<------------------------------< Exports : router >----------------------------------------->//
module.exports = { authentication, authorization,checkuserId };
