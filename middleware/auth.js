const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const userId = req.cookies.userId;

        // Load user into locals
        if (userId) {
            const user = await User.findById(userId).lean();
            res.locals.user = user;
        } else {
            res.locals.user = null;
        }

        // Public routes
        const allowedPaths = [
            "/",
            "/splash",
            "/page/login",
            "/page/signup",
            "/user/login",
            "/user/signup",
            "/forgetPassword",
            "/user/forgetPassword/sendOtp",
            "/user/forgetPassword/verifyOtp",
            "/user/forgetPassword/resetPassword"
        ];

        if (allowedPaths.includes(req.path)) return next();

        // No user → redirect
        if (!userId) return res.redirect("/page/login");

        next();
    } catch (err) {
        console.log("Middleware error:", err);
        res.redirect("/page/login");
    }
};
