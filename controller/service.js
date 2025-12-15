const Service = require("../models/service");
const Booking = require("../models/booking");

// CREATE SERVICE
createService = async (req, res) => {
    try {
        const provider = res.locals.user;

        if (!provider || provider.role !== "provider") {
            return res.status(403).send("Only providers can add services");
        }
        const { mainCategory, name, price, mrp } = req.body;

        await Service.create({
            mainCategory,
            name,
            price,
            mrp,
            providerName: provider.name,
            phone:provider.phone,
            providerId: provider._id,
            image: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : null
        });

        res.redirect(`/page/${mainCategory}`);
    } catch (error) {
        console.log(error);
        res.send("Error while adding service");
    }
};

//DELETE A SERVICE 
deleteService = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) return res.status(401).send("Login required");

        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).send("Service not found");

        // Authorization check
        if (
            user.role !== "provider" ||
            service.providerId.toString() !== user._id.toString()
        ) {
            return res.status(403).send("Not allowed");
        }

        const category = service.mainCategory;

        // 1️⃣ Delete bookings linked to service
        await Booking.deleteMany({ serviceId: service._id });

        // 2️⃣ Delete the service itself (THIS WAS MISSING)
        await Service.findByIdAndDelete(service._id);

        res.redirect(`/page/${category}`);
    } catch (err) {
        console.error("Delete Service Error:", err);
        res.status(500).send("Internal Server Error");
    }
};

// SINGLE SERVICE DETAILS
getServiceDetails = async (req, res) => {
    const service = await Service.findById(req.params.id).lean();
    if (!service) return res.send("Service not found");

    res.render("serviceDetails", { service });
};

// SERVICE IMAGE
getServiceImage = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service || !service.image) return res.send("No Image");

    res.contentType(service.image.contentType);
    res.send(service.image.data);
};

module.exports = { deleteService, createService, getServiceDetails, getServiceImage };
