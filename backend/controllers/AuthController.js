const User = require('../models/UserModel');
const { createSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcryptjs');

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
        res.status(201).json({ message: "User logged in successfully", success: true, quizCompleted: user.quizCompleted });
        next();
    } catch (err) {
        console.error(err);
    }
}

module.exports.submitQuiz = async (req, res, next) => {
    const { userId, preferences } = req.body;

    try {
        // Validate user ID
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (
            !preferences ||
            typeof preferences.dietaryPreference !== 'string' || // dietaryPreference should be a string
            !Array.isArray(preferences.allergies) ||  // allergies should be an array
            typeof preferences.weeklyBudget !== "number"
        ) {
            return res.status(400).json({ message: "Invalid preferences data" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.preferences = preferences;
        user.quizCompleted = true;
        await user.save();

        res.status(200).json({ message: "Preferences saved successfully" });
        next();
    } catch (error) {
        console.error("Error saving preferences: ", error);
        res.status(500).json({ message: "Internal server error "});
    }
}

