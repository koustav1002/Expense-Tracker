const User = require("../models/UserModel");
const {
  hashedPassword,
  comparePassword,
  createJWT,
} = require("../libs/index.js");

const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(404).json({
        status: "failed",
        message: "Provide required fields!",
      });
    }

    if (await User.findOne({ email: email })) {
      return res.status(400).json({ msg: "Username already exists!" });
      // throw new Error("Username already exists! Try something else.");
    }

    const hashPassword = await hashedPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      user,
      token: createJWT(user._id)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid password!!",
      });
    }

    const token = createJWT(user._id);

    user.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Login successfull!",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

module.exports = { signinUser, signupUser };
