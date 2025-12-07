const mongoose = require("mongoose");

async function connectToDB(url) {
    try {
        await mongoose.connect(url);
    } catch (err) {
        console.error("Mongoose connection error:", err.message);
        throw err; // Send error back to caller
    }
}
module.exports = connectToDB;