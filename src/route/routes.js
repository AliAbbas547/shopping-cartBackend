//<----------------------< Importing : Packages >---------------------->//
const express = require('express');
const { createUser, logInUserData, getUserData, updateUserData } = require('../controller/userController.js');
const { authentication } = require('../middleware/auth.js');
const router = express.Router();
const { createProducts } = require('../controller/productcontroller')


//<----------------------< Create User Data >-------------------------->//
router.post('/register', createUser);
//<----------------------< LogIn User Data >--------------------------->//
router.get('/login', logInUserData);
//<----------------------< Get User Data >----------------------------->//
router.get('/user/:userId/profile', authentication, getUserData);
//<----------------------< Update User Data >-------------------------->//
router.put('/user/:userId/profile',authentication, updateUserData);


router.post('/products', createProducts)
//<----------------------< Exports : router >-------------------------->//
module.exports = router;