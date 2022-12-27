//<----------------------< Importing : Packages >---------------------->//
const express = require("express");
const {
  createUser,
  logInUserData,
  getUserData,
  updateUserData,
} = require("../controller/userController.js");
const {authentication,authorization} = require("../middleware/auth.js");
const router = express.Router();
const {
  createProducts,
  getProductsData,
  getProductsDataById,
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
router.post("/login", logInUserData);
router.get("/user/:userId/profile", authentication,authorization, getUserData);
router.put("/user/:userId/profile", authentication,authorization, updateUserData);

router.post("/products", createProducts);
router.get("/products", getProductsData);
router.get('/products/:productId',getProductsDataById)
router.put("/products/:productId", updateProductData);
router.delete("/products/:productId", deleteProductData);

router.post("/users/:userId/cart", authentication,authorization, createCart);
router.put("/users/:userId/cart", authentication,authorization, updateCart);
router.get("/users/:userId/cart", authentication,authorization, getCartData);
router.delete("/users/:userId/cart", authentication,authorization, deleteCartData);

router.post("/users/:userId/orders", authentication,authorization, createOder);
router.put("/users/:userId/orders", authentication,authorization, updateOrder);
//<----------------------< Exports : router >-------------------------->//
module.exports = router;
