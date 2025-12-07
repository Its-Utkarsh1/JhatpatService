const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    serviceName: { type: String, required: true },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
        required: true
    },

    providerName: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
        default: "requested"
    },
    image: {
        data: Buffer,
        contentType: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
