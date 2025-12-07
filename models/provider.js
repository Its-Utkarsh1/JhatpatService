const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    photo: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Provider", providerSchema);
