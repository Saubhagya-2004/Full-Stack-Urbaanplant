const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validation } = require("../utils/validation");
// ✅ Signup Controller
exports.signup = async (req, res) => {
  try {
    validation(req);
    const { password } = req.body;
    const user = new User(req.body);

    const passwordhash = await bcrypt.hash(password, 10);
    user.password = passwordhash;

    const data = await user.save();
    res.status(200).json({ message: "User created", data });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const allowed = ["email", "password"];
    const isallowed = Object.keys(req.body).every((key) => {
      return allowed.includes(key);
    });
    if (!isallowed) {
      throw new Error("Invalid request!!");
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email");

    const ispasswordvalid = await user.validatepassword(password);
    if (!ispasswordvalid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = await user.getjwt();
    const expiretoken = new Date(Date.now() + 8 * 3600000);
    await User.findByIdAndUpdate(user._id, { activetoken: token, expiretoken });

    res.cookie("token", token, {
      httpOnly: true,
      expires: expiretoken,
      secure: true,
    });
    res.json({ data: user, message: "Login successful!!" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ message: "Invalid login request" });
  }
};

// profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "User profile", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.send(req.user.Firstname + " logged out successfully");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  Update Password
exports.updatePassword = async (req, res) => {
  try {
    const allowed = ["password", "email"];
    const isallowed = Object.keys(req.body).every((key) => {
      return allowed.includes(key);
    });
    if (!isallowed) {
      throw new Error("Invalid Request !!");
    }
    const { password, email } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password required" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email does not exist !!" });

    const passwordhash = await bcrypt.hash(password, 10);
    user.password = passwordhash;
    await user.save();

    res
      .status(200)
      .json({ message: `Password updated successfully for ${user.email}` });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating password: " + err.message });
  }
};
