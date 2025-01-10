const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" }); // 401 Unauthorized
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Invalid token" }); // 401 Unauthorized
    }

    // Find the user based on the ID from the token payload
    const user = await User.findById(data.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" }); // 404 Not Found
    }

    // Check if the user has completed the quiz
    if (!user.quizCompleted) {
      return res.status(403).json({ // 403 Forbidden
        status: false,
        message: "Please complete the quiz",
        redirectToQuiz: true, // Indicating the need for redirection
      });
    }

    // If the user is authenticated and has completed the quiz, proceed
    return res.status(200).json({ status: true, user: user.username }); // 200 OK
  });
};
