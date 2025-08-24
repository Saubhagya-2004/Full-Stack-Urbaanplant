const jwt = require("jsonwebtoken");
const User = require('../models/user');
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(400).json("Unauthorized Acess : Token not found");
    }
    const decodedmessage = await jwt.verify(token, "Urban@#**2025^");
    const { _id } = decodedmessage;
    const user = await User.findById(_id);
    if (!user) { 
      return res.status(404).send("User not found");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized access, please login " + err.message);
  }
};
module.exports = { userAuth };