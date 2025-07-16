const jwt = require("jsonwebtoken");

// Expiry durations
const accessExpiresInSeconds = 10 * 60; // 10 minutes
const refreshExpiresInSeconds = 16 * 60 * 60; // 16 hours

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "access",
    },
    process.env.JWT_SECRETKEY,
    { expiresIn: accessExpiresInSeconds }
  );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: refreshExpiresInSeconds }
  );
};

// Generating both tokens with timestamps
const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const accessExpiresAt = new Date(
    Date.now() + accessExpiresInSeconds * 1000
  ).toISOString();
  const refreshExpiresAt = new Date(
    Date.now() + refreshExpiresInSeconds * 1000
  ).toISOString();

  return {
    access: {
      token: accessToken,
      expiresAt: accessExpiresAt,
    },
    refresh: {
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    },
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
