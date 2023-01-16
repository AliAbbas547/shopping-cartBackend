//<----------------------< Importing : Packages >---------------------->//
const userModel = require("../models/userModel.js");
const aws = require("../AWS/AWS.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const errorHandler = require("../errorHandling/errorHandling");
const validation = require("../validation/validation");
//<----------------------< Create : UserFunction >--------------------->//
const createUser = async (req, res) => {
  try {
    const data = req.body;
    const {title,name,phone,email,password,street,city,pincode} = data;
    let address={
      "street":street,
      "city":city,
      "pincode":pincode
    }
    data.address=address;
    data.password = await bcrypt.hash(data.password, 10);
    const datacreate = await userModel.create(data);
    res.status(201).send({ status: true, data: datacreate });
  } catch(err) {
    return errorHandler(err, res);
  }
};

//<----------------------< LogIn User Data from DataBase >------------------->//

const logInUserData = async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0)
      return res.status(400).send({
        status: false,
        message: "Pls provide the Email-id and password",
      });
    const { email, password } = data;
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Pls provide the emailId" });
    if (!validation.isValidEmailId(email))
      return res
        .status(400)
        .send({ status: false, message: "pls provide the Valid Email" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Pls provide the password" });

    const user = await userModel.findOne({ email: email });

    if (!user)
      return res
        .status(404)
        .send({ status: false, message: "You are not a valid user" });

    const checkpasword = await bcrypt.compare(password, user.password);

    if (!checkpasword)
      return res.status(400).send({ message: "Invalid password" });

    let token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "project-5-Products_Management",
      { expiresIn: "12h" }
    );

    return res.status(200).send({
      status: true,
      message: "User login successfull",
      userId: { userId: user._id, token: token },
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

//<----------------------< Get User Data from DataBase >------------------->//

const getUserData = async (req, res) => {
  try {
    const id = req.params.userId;

    const data = await userModel
      .findById(id)
      .select({ createdAt: 0, updatedAt: 0, __v: 0 })
      .lean();
    const { address, ...userdata } = data;
    res.status(200).send({
      status: true,
      message: "User profile details",
      data: data.address,
      userdata,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

//<----------------------< Update User Data from DataBase >------------------->//
const updateUserData = async (req, res) => {
  try {
    const id = req.params.userId;
    const data = req.body;
    let uploadedFileURL;
    let files = req.files;
    if (files && files.length > 0) {
      uploadedFileURL = await aws.uploadFile(files[0]);
    }
    if (uploadedFileURL) {
      data["profileImage"] = uploadedFileURL;
    }
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Body is Empty Pls provide the data" });
    const upadateUser = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...data } },
      { runValidators: true }
    );
    res.status(200).send({ status: true, msg: upadateUser });
  } catch (err) {
    return errorHandler(err, res);
  }
};

//<----------------------< Exports : UserFunction >------------------------>//
module.exports = { createUser, logInUserData, getUserData, updateUserData };
