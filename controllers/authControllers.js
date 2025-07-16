const User = require('../models/user');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');
const tokens = require('../utils/generateTokens')
const decoded = require('../middlewares/auth.middleware');


//registering a new user
exports.register = async (req, res) => {
  try {

    
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Please fill all the fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed!" });
  }
};

//login with user email and password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password!" });

    const { accessToken, refreshToken } = generateTokens(user._id);
    const tokens = generateTokens(user._id);

    // Send refreshToken in HttpOnly cookie
    res.cookie('refreshToken', tokens.refresh.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

    res.status(200).json({userData,tokens});
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed!" });
  }
};

//refresh the accesss token using the refresh token 
exports.refresh = async (req, res) => {
  const token = req.body.refresh || req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    try {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      
      const tokens = generateTokens(user._id);

      res.cookie('refreshToken', tokens.refresh.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 16 * 60 * 60 * 1000,
      });

      res.status(200).json({tokens});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });
};

//logout the user by with removing refresh token
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: "Logged out successfully" });
};
