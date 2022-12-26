//__________________________ Import  ___________________________________________

const mongoose = require("mongoose");

//__________________________ Validations : Name ___________________________________________

const isValidName = function (name) {
  const fnameRegex = /^([a-zA-Z])+$/;
  return fnameRegex.test(name);
};

//__________________________ Validations : Email  ___________________________________________

const isValidEmailId = function (email) {
  const emailRegex =
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
  return emailRegex.test(email);
};

//__________________________ Validations : Password  ___________________________________________

const isValidPassword = function (password) {
  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};
//__________________________ Validations : Password  ___________________________________________

const isValidMobile = function (mobile) {
  const MobileRegex =
  /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return MobileRegex.test(mobile);
};
//__________________________ Validations : Values ___________________________________________

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value == "string" && value.trim().length === 0) return false;
  return true;
};

//__________________________ Validations :  ObjectId ___________________________________________

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//__________________________ Export : Modules  ___________________________________________

module.exports = {
  isValid,
  isValidEmailId,
  isValidName,
  isValidPassword,
  isValidObjectId,
  isValidMobile
};
