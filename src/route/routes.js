//<----------------------< Importing : Packages >---------------------->//
const express = require('express');
const { createUser, logInUserData, getUserData, updateUserData } = require('../controller/userController.js');
const { authentication } = require('../middleware/auth.js');
const router = express.Router();
const { createProducts,getProductsData } = require('../controller/productcontroller')
const {createCart ,updateCart ,getCartData,deleteCartData} = require('../controller/cartController')
const {createOder ,updateOrder } = require('../controller/oderController')
//<----------------------< Create User Data >-------------------------->//
router.post('/register', createUser);
//<----------------------< LogIn User Data >--------------------------->//
router.get('/login', logInUserData);
//<----------------------< Get User Data >----------------------------->//
router.get('/user/:userId/profile', authentication, getUserData);
//<----------------------< Update User Data >-------------------------->//
router.put('/user/:userId/profile',authentication, updateUserData);


router.post('/products', createProducts)
router.get('/products',  getProductsData)


router.post('/users/:userId/cart',createCart)
router.put('/users/:userId/cart', updateCart)
router.get('/users/:userId/cart', getCartData)
router.delete('/users/:userId/cart', deleteCartData)


router.post('/users/:userId/orders',createOder)
router.put('/users/:userId/orders',updateOrder)
//<----------------------< Exports : router >-------------------------->//
module.exports = router;