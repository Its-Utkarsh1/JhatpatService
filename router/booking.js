const express = require("express");
const router = express.Router();

const {
    createBooking,
    getUserBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    getBookingDetails
} = require("../controller/booking");

// User Routes
router.post("/create", createBooking);
router.get("/my", getUserBookings);
router.post("/cancel/:id", cancelBooking);
router.get("/details/:id", getBookingDetails);
router.get("/all", getAllBookings);
router.post("/updateStatus/:id", updateBookingStatus);

module.exports = router;
