const jwt = require("jsonwebtoken");
const errorHandler = require("../errorHandling/errorHandling");

//<-------------------------------------< Authentication >------------------------------------->//
const authentication = function (req, res, next) {
  try {
    let bearerHeader = req.headers.authorization;

    if (typeof bearerHeader == "undefined")
      return res
        .status(400)
        .send({
          status: false,
          message: "Token is missing, please enter a token",
        });

    let bearerToken = bearerHeader.split(" ");

    let token = bearerToken[1];

    jwt.verify(token, "project-5-Products_Management");
    next();
  } catch (err) {
    return errorHandler(err, res);
  }
};

//<------------------------------< Exports : router >----------------------------------------->//
module.exports = { authentication };
