const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mainCategory: { type: String, required: true },
    description: String,
    price: {
        type: Number,
        required: true
    },
    mrp: Number,
    providerName: {
        type: String,
        required: true
    },
    providerMobileNumber: {
        type: String,
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
