const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'Your username is required'],
    },
    password: {
        type: String,
        required: [true, 'Your password is required'],
    },
    preferences: {
        dietaryPreference: { type: String, default: "None", enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', "None"]},
        allergies: { type: [String], default: [] },
        weeklyBudget: { type: Number, default: 50, validate: {
            validator: function(value) {
                return value >= 10 && value <= 200;
            },
            message: 'Weekly budget must be between $10 and $200.',
        }}
    },
    quizCompleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
});

// Middleware to hash the user's password with bcrypt before saving it to the database
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12); // hashes pw with 12 rounds of hashing and saves hashed pw to db
});

module.exports = mongoose.model('User', userSchema)