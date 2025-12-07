const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    role: {
        type: String,
        enum: ["user", "provider"],
        default: "user"
    },
    profilePic: { data: Buffer, contentType: String },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
