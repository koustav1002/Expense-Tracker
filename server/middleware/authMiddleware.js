const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res
      .status(402)
      .json({ status: "auth_failed", msg: "Authentication failed!" });
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);

    res
      .status(401)
      .json({ status: "auth_failed", msg: "Authentication failed!" });
  }
};

module.exports = authMiddleware;
