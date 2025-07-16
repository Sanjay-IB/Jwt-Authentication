const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const accessExpiresInSeconds = 10 * 60;
  const refreshExpiresInSeconds = 16 * 60 * 60;

  const accessExpiresAt = new Date(
    Date.now() + accessExpiresInSeconds * 1000
  ).toISOString();
  const refreshExpiresAt = new Date(
    Date.now() + refreshExpiresInSeconds * 1000
  ).toISOString();

  

  const accessToken = jwt.sign({
      id: userId,
      type: "access"
    },
    process.env.JWT_SECRETKEY, {
      expiresIn: accessExpiresInSeconds,
    }
  );
  const refreshToken = jwt.sign({
      id: userId,
      type: "refresh"
    },
    process.env.JWT_REFRESH_SECRET, {
      expiresIn: refreshExpiresInSeconds,
    }
  );

  return {
  
      access: {
        token: accessToken,
        expiresAt: accessExpiresAt
      },

      refresh: {
        token: refreshToken,
        expiresAt: refreshExpiresAt
      }
  

  };
};

module.exports = generateTokens;