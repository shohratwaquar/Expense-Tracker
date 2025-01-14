const model = require("../models/usersModel");
const User = model.User;
const bcrypt = require("bcryptjs");

exports.authenticatePassword = async (req, res, next) => {
  const user = req.user;
  const { _id } = user;
  const password  = req.body.password || user.password;
  try {
    const user = await User.findById(_id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      next();
    } else {
      console.log("Invlaid password");
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.log("error occurred", error);
  }
};
