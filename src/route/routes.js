//<----------------------< Importing : Packages >---------------------->//
const express = require("express");
const {
  createUser,
  logInUserData,
  getUserData,
  updateUserData,
} = require("../controller/userController.js");
const { authentication } = require("../middleware/auth.js");
const router = express.Router();
const {
  createProducts,
  getProductsData,
  updateProductData,
  deleteProductData,
} = require("../controller/productcontroller");
const {
  createCart,
  updateCart,
  getCartData,
  deleteCartData,
} = require("../controller/cartController");
const { createOder, updateOrder } = require("../controller/oderController");

router.post("/register", createUser);
router.get("/login", logInUserData);
router.get("/user/:userId/profile", authentication, getUserData);
router.put("/user/:userId/profile", authentication, updateUserData);

router.post("/products", createProducts);
router.get("/products", getProductsData);
router.put("/products/:productId", updateProductData);
router.delete("/products/:productId", deleteProductData);

router.post("/users/:userId/cart", authentication, createCart);
router.put("/users/:userId/cart", authentication, updateCart);
router.get("/users/:userId/cart", authentication, getCartData);
router.delete("/users/:userId/cart", authentication, deleteCartData);

router.post("/users/:userId/orders", authentication, createOder);
router.put("/users/:userId/orders", authentication, updateOrder);
//<----------------------< Exports : router >-------------------------->//
module.exports = router;
