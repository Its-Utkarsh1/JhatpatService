const express = require("express");
const router = express.Router();

const {
    getProviderProfile,
    updateProviderProfile,
    getProviderServices,
    getProviderBookings,
    acceptBooking,
    rejectBooking,
    startBooking,
    completeBooking
} = require("../controller/provider");

// PROVIDER PROFILE
router.get("/profile/:id", getProviderProfile);
router.put("/profile/:id", updateProviderProfile);

// PROVIDER SERVICES
router.get("/services/:providerId", getProviderServices);

// PROVIDER — View all their bookings
router.get("/request", getProviderBookings);

// PROVIDER — Booking Actions
router.post("/booking/accept/:id", acceptBooking);
router.post("/booking/reject/:id", rejectBooking);
router.post("/booking/start/:id", startBooking);
router.post("/booking/complete/:id", completeBooking);

module.exports = router;
