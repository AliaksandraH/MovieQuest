const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    username: {
        type: String,
        minlength: [1, "Username must be at least 1 character long"],
        maxlength: [25, "Username must be at most 25 characters long"],
        required: [true, "Please provide username"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
    },
});

// Encrypt password before saving user to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const saltRounds = process.env.SALT_ROUNDS || 12;
    this.password = await bcrypt.hash(this.password, +saltRounds);

    this.passwordConfirm = undefined;
    next();
});

// Instance method to compare passwords
userSchema.methods.comparePasswords = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = model("User", userSchema);
