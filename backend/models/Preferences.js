const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema({
    dietaryPreference: {
        type: String,
        default: "None",
        enum: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "None"],
    },
    allergies: {
        type: [String],
        default: [],
    },
    weeklyBudget: {
        type: Number,
        default: 50,
        validate: {
            validator: function (value) {
                return value >= 10 && value <= 200;
            },
            message: "Weekly budget must be between $10 and $200.",
        },
    },
});

module.exports = mongoose.model("Preferences", preferencesSchema);
