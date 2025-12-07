const Booking = require("../models/booking");
const Service = require("../models/service");

// CREATE BOOKING
createBooking = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { serviceId, date, time } = req.body;

        console.log("👉 Creating booking for:", { userId, serviceId, date, time });

        const service = await Service.findById(serviceId);

        if (!service) {
            console.log("❌ Service not found for id:", serviceId);
            return res.send("Service not found");
        }

        console.log("🔍 Service from DB:", service);

        if (!service.providerId) {
            console.log("❌ providerId missing on service:", service._id);
            return res.send("This service has no provider assigned. Please re-add service.");
        }

        await Booking.create({
            userId,
            serviceId,
            serviceName: service.name,
            providerName: service.providerName,
            providerId: service.providerId,   // 👈 yahi required hai
            price: service.price,
            date,
            time,
            status: "requested"
        });

        console.log("✅ Booking created successfully");
        res.redirect("/page/booking");

    } catch (err) {
        console.log("💥 Booking create error:", err);
        res.send("Booking error");
    }
};


// GET ALL BOOKINGS FOR USER
getUserBookings = async (req, res) => {
    try {
        const userId = req.cookies.userId;

        const bookings = await Booking.find({ userId }).lean();

        res.render("bookings", { bookings });
    } catch (err) {
        console.log("User bookings error:", err);
        res.send("Error loading bookings");
    }
};

// CANCEL BOOKING
cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.send("Booking not found");

        // User can cancel only requested / accepted bookings
        if (booking.status === "completed") {
            return res.send("Cannot cancel completed booking");
        }

        await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });

        res.redirect("/page/booking");

    } catch (err) {
        console.log("Cancel booking error:", err);
        res.send("Error cancelling booking");
    }
};

// ADMIN: GET ALL BOOKINGS
getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().lean();
        res.render("adminBookings", { bookings });
    } catch (err) {
        console.log("Admin - load bookings error:", err);
        res.send("Admin booking error");
    }
};

// UPDATE BOOKING STATUS
updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    await Booking.findByIdAndUpdate(req.params.id, { status });
    res.redirect("/admin/bookings");
};

// BOOKING DETAILS
getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).lean();

        if (!booking) return res.send("Booking not found");

        res.render("bookingDetails", { booking });

    } catch (err) {
        console.log("Booking details error:", err);
        res.send("Error loading booking");
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking, getAllBookings, updateBookingStatus, getBookingDetails };