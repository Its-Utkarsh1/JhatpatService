const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    signup,
    login,
    logout,
    updateProfile,
    getProfile,
    cancelBooking,
    sendOtp,
    verifyOtp,
    getProfilePic,
    resetPassword
} = require("../controller/user");

// ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.post("/updateProfile", upload.single("profilePic"), updateProfile);
router.get("/profile", getProfile);
router.get("/profilePic/:id", getProfilePic);

router.post("/cancelBooking/:id", cancelBooking);

router.post("/forgetPassword/sendOtp", sendOtp);
router.post("/forgetPassword/verifyOtp", verifyOtp);
router.post("/forgetPassword/resetPassword", resetPassword);

module.exports = router;
