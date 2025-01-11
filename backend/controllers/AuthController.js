const User = require('../models/User');
const Preferences = require('../models/Preferences')
const { createSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user._id);
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
        next(); // call next middleware
    } catch (err) {
        console.error(err);
    }
}

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({message: 'All fields are required'})
        }
        const user = await User.findOne({ email });

        if(!user) {
            return res.json({ message: 'Incorrect password or email'})
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({message: 'Incorrect password or email'})
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({
          message: "User logged in successfully",
          success: true,
          quizCompleted: user.quizCompleted,
        });

        
        next();
    } catch (err) {
        console.error(err);
    }
};


module.exports.submitQuiz = async (req, res, next) => {
    const { preferences } = req.body;
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ message: "No token provided, authentication required", success: false });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decoded.id;

        if (
            !preferences ||
            typeof preferences.dietaryPreference !== 'string' ||
            !Array.isArray(preferences.allergies) ||
            typeof preferences.weeklyBudget !== "number"
        ) {
            return res.status(400).json({ message: "Invalid preferences data", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let userPreferences = await Preferences.findOne({ userId });
        if (userPreferences) {
            // Update existing preferences
            userPreferences.dietaryPreference = preferences.dietaryPreference;
            userPreferences.allergies = preferences.allergies;
            userPreferences.weeklyBudget = preferences.weeklyBudget;
            await userPreferences.save();
        } else {
            userPreferences = new Preferences({
                dietaryPreference: preferences.dietaryPreference,
                allergies: preferences.allergies,
                weeklyBudget: preferences.weeklyBudget,
            });
            await userPreferences.save();
        }

        user.quizCompleted = true;
        await user.save();

        res.status(200).json({ message: "Preferences saved successfully", success: true });
        next();
    } catch (error) {
        console.error("Error saving preferences: ", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};