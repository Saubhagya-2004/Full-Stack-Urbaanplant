const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserScema = new mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
      minLength: 3,
    },
    Lastname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
      minLength: 3,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
    Role:{
        type: String,
        required: true,
        trim: true,
        enum: ["user", "admin"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid Email");
        }
        if(!validator.isLowercase(value)){
                throw new Error("Invalid Email "+value)
            }
        
      },
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validator(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid Password");
        }
      },
    },
    profile: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX7HRicGdWDIgAs9L2WZqSw-rpPd7VWrD0pvS0gQmc0hzoi9zJJA0ZEXH7aExSmGP1ZCU&usqp=CAU",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Url" + value);
        }
      },
    },
    city: {
      type: String,
      // required: true,
      trim: true,
    },
    State: {
      type: String,
      // required: true,
      trim: true,
    },
    country: {
      type: String,
      // required: true,
      trim: true,
    },
    pincode: {
      type: String,
      trim:true,
      maxLength: 6,
      minLength: 6,
      required: true,
      validator(value) {
        if (!validator.isNumeric(value)) {
          throw new Error("Invalid Pincode");
        }
         if (!/^[1-9][0-9]{5}$/.test(value)) {
          throw new Error("Invalid Indian Pincode (must be 6 digits)");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
UserScema.methods.getjwt = async function(){
const userAuth = this;
const token = await jwt.sign({_id:userAuth._id},process.env.JWT_SECRET,{
    expiresIn:"20d"
})
return token
};
UserScema.methods.validatepassword = async function(passwordinputbyuser) {
    const user = this;
    const passwordhash = user.password;
    const ispasswordvalid = await bcrypt.compare(passwordinputbyuser,passwordhash);
    return ispasswordvalid;
};
module.exports = mongoose.model("user",UserScema);
