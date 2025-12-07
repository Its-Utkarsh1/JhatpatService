const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Service = require("../models/service");
const Booking = require("../models/booking");


// ================== Main Pages GET Routes ==================
router.get("/login", (req,res)=> res.render("login"));
router.get("/signup",(req,res)=> res.render("signup",{ error: null }));
router.get("/home",(req,res)=> res.render("home"));
router.get("/categories",(req,res)=> res.render("categories"));
router.get("/booking", async (req, res) => {
    const user = res.locals.user;

    if (!user) return res.redirect("/page/login");

    // Fetch bookings + populate service
    const bookings = await Booking.find({ userId: user._id })
        .populate("serviceId")
        .lean();

    // Filter those whose service is deleted
    const filtered = bookings.filter(b => b.serviceId !== null);

    res.render("booking", { bookings: filtered });
});




router.get("/profile", async (req, res) => {
    const user = await User.findById(req.cookies.userId).lean();
    res.render("profile", { user });
});
router.get("/editProfile",(req,res)=> res.render("editProfile"));
router.get("/privacyPolicy",(req,res)=> res.render("privacyPolicy"));
router.get("/termsConditions",(req,res)=> res.render("termsConditions"));
router.get("/acTips",(req,res)=> res.render("acTips"));
router.get("/cleaningTricks",(req,res)=> res.render("cleaningTricks"));
router.get("/washingMachine",(req,res)=> res.render("washingMachine"));



// ================== Services GET Routes ==================

// Cleaning Page
router.get("/cleaning", async (req, res) => {
    const services = await Service.find({ mainCategory: "cleaning" }).lean();
    res.render("Services/cleaning", {mainCategory: "cleaning",services,user: res.locals.user});
});

//Repairing Page
router.get("/repairing", async (req, res) => {
    const services = await Service.find({ mainCategory: "repairing" }).lean();
    res.render("Services/repairing", {mainCategory: "repairing",services,user: res.locals.user});
});

//Appliences Page
router.get("/appliances", async (req, res) => {
    const services = await Service.find({ mainCategory: "appliances" }).lean();
    res.render("Services/appliances", {mainCategory: "appliances",services,user: res.locals.user});
});

// Beauty Page
router.get("/beauty", async (req, res) => {
    const services = await Service.find({ mainCategory: "beauty" }).lean();
    res.render("Services/beauty", {mainCategory: "beauty",services,user: res.locals.user});
});

// Vechicle Page
router.get("/vehicle", async (req, res) => {
    const services = await Service.find({ mainCategory: "vehicle" }).lean();
    res.render("Services/vehicle", {mainCategory: "vehicle",services,user: res.locals.user});
});

// Electronics Page
router.get("/electronics", async (req, res) => {
    const services = await Service.find({ mainCategory: "electronics" }).lean();
    res.render("Services/electronics", { mainCategory: "electronics", services,user: res.locals.user });
});

// Ac Repair Page
router.get("/acRepair", async (req, res) => {
    const services = await Service.find({ mainCategory: "acRepair" }).lean();
    res.render("Services/acRepair", { mainCategory: "acRepair", services,user: res.locals.user });
});

// Plumbing Page
router.get("/plumbing", async (req, res) => {
    const services = await Service.find({ mainCategory: "plumbing" }).lean();
    res.render("Services/plumbing", { mainCategory: "plumbing", services,user: res.locals.user });
});

// Painting Page
router.get("/painting", async (req, res) => {
    const services = await Service.find({ mainCategory: "painting" }).lean();
    res.render("Services/painting", { mainCategory: "painting", services ,user: res.locals.user});
});

// Shifting Page
router.get("/shifting", async (req, res) => {
    const services = await Service.find({ mainCategory: "shifting" }).lean();
    res.render("Services/shifting", { mainCategory: "shifting", services ,user: res.locals.user});
});

// Laundary Page
router.get("/laundry", async (req, res) => {
    const services = await Service.find({ mainCategory: "laundry" }).lean();
    res.render("Services/laundry", { mainCategory: "laundry", services ,user: res.locals.user});
});

// Massage Page
router.get("/massage", async (req, res) => {
    const services = await Service.find({ mainCategory: "massage" }).lean();
    res.render("Services/massage", { mainCategory: "massage", services ,user: res.locals.user});
});


module.exports = router;