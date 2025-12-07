const User = require("../models/user");
const Service = require("../models/service");
const Booking = require("../models/booking");

// GET PROVIDER PROFILE
async function getProviderProfile(req, res) {
    try {
        const { id } = req.params;
        const provider = await User.findById(id);

        if (!provider || provider.role !== "provider")
            return res.status(404).json({ message: "Provider not found" });

        return res.json(provider);

    } catch (err) {
        console.error("Get Provider Profile Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// UPDATE PROVIDER PROFILE
async function updateProviderProfile(req, res) {
    try {
        const { id } = req.params;
        const { name, phone, email, address } = req.body;

        const provider = await User.findByIdAndUpdate(
            id,
            { name, phone, email, address },
            { new: true }
        );

        if (!provider)
            return res.status(404).json({ message: "Provider not found" });

        return res.json(provider);

    } catch (err) {
        console.error("Update Provider Profile Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function reloadProviderPage(req, res) {
    const provider = res.locals.user;

    const bookings = await Booking.find({ providerId: provider._id })
        .populate("userId", "name phone")
        .populate("serviceId", "name price");

    return res.render("providerBooking", { bookings, provider });
}




// GET PROVIDER SERVICES
async function getProviderServices(req, res) {
    try {
        const { providerId } = req.params;

        const services = await Service.find({ providerId });

        return res.json(services);

    } catch (err) {
        console.error("Get Provider Services Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// GET PROVIDER BOOKINGS
async function getProviderBookings(req, res) {
    try {
        const provider = res.locals.user;

        if (!provider || provider.role !== "provider") {
            return res.redirect("/page/login");
        }

        const bookings = await Booking.find({ providerId: provider._id })
            .populate("userId", "name phone")
            .populate("serviceId", "name price");

        res.render("providerBooking", { bookings, provider });

    } catch (err) {
        console.error("Provider Bookings Error:", err);
        res.status(500).send("Internal Server Error");
    }
}


// ACCEPT BOOKING
async function acceptBooking(req, res) {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).send("Booking not found");

        if (booking.status !== "requested")
            return res.status(400).send("Already processed");

        booking.status = "accepted";
        await booking.save();

        return reloadProviderPage(req, res);   // 🔥 Render same page with updated data

    } catch (err) {
        console.error("Accept Booking Error:", err);
        return res.status(500).send("Internal server error");
    }
}



// REJECT BOOKING
async function rejectBooking(req, res) {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).send("Booking not found");

        if (booking.status !== "requested")
            return res.status(400).send("Already processed");

        booking.status = "cancelled";
        await booking.save();

        return reloadProviderPage(req, res);

    } catch (err) {
        console.error("Reject Booking Error:", err);
        return res.status(500).send("Internal server error");
    }
}




// START WORK
async function startBooking(req, res) {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).send("Booking not found");

        if (booking.status !== "accepted")
            return res.status(400).send("Cannot start before accept");

        booking.status = "ongoing";
        await booking.save();

        return reloadProviderPage(req, res);

    } catch (err) {
        console.error("Start Booking Error:", err);
        return res.status(500).send("Internal server error");
    }
}



// COMPLETE WORK
async function completeBooking(req, res) {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).send("Booking not found");

        if (booking.status !== "ongoing")
            return res.status(400).send("Cannot complete before start");

        booking.status = "completed";
        await booking.save();

        return reloadProviderPage(req, res);

    } catch (err) {
        console.error("Complete Booking Error:", err);
        return res.status(500).send("Internal server error");
    }
}



module.exports = {
    getProviderProfile,
    updateProviderProfile,
    getProviderServices,
    getProviderBookings,
    acceptBooking,
    rejectBooking,
    startBooking,
    completeBooking
};
