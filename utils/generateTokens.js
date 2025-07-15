const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "16h",
  });
  return { accessToken, refreshToken };
};

module.exports = generateToken;
