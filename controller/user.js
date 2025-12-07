const User = require("../models/user");
const path = require("path");
const Booking = require("../models/booking");
const bcrypt = require("bcrypt");
const transporter = require("../utils/mailer");

// SIGNUP
signup = async (req, res) => {
    try {
        const { name, phone, email, role, address, password } = req.body;

        // Check if email already exists
        const existing = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existing) {
            return res.render("signup", {
                error: "User already exists with this email or number!",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            name,
            phone,
            email,
            role,
            address,
            password: hashedPassword
        });

        res.redirect("/page/login");

    } catch (err) {
        console.log(err);
        res.status(500).send("Signup failed");
    }

};

// LOGIN
login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "User not found!" })
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render("login", { error: "Invalid password!" });
        }

        // ⭐ SET COOKIE HERE (MAIN STEP)
        res.cookie("userId", user._id.toString(), {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        res.redirect("/page/home");


    } catch (err) {
        console.log("Login error:", err);
        return res.render("login", { error: "Internal server error!" });
    }
};

// LOGOUT
logout = (req, res) => {
    res.clearCookie("userId");
    res.redirect("/page/login");
};

// UPDATE PROFILE
updateProfile = async (req, res) => {
    const userId = req.cookies.userId;

    let update = {};

    if (req.body.name && req.body.name.trim() !== "") {
        update.name = req.body.name;
    }

    if (req.body.phone && req.body.phone.trim() !== "") {
        update.phone = req.body.phone;
    }

    if (req.body.email && req.body.email.trim() !== "") {
        update.email = req.body.email;
    }

    if (req.body.address && req.body.address.trim() !== "") {
        update.address = req.body.address;
    }

    // Step 2 — If profile picture uploaded
    if (req.file) {
        update.profilePic = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    // Step 3 — Update only the changed fields
    await User.findByIdAndUpdate(userId, update);

    res.redirect("/page/profile");
};


//PROFILE_PIC
getProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // No user OR no photo → send default image
        if (!user || !user.profilePic) {
            return res.sendFile(
                path.join(__dirname, "../Public/assets/default.jpg")
            );
        }

        // If profilePic exists → send DB buffer
        res.contentType(user.profilePic.contentType);
        res.send(user.profilePic.data);

    } catch (err) {
        // Any error → return default image
        return res.sendFile(
            path.join(__dirname, "../Public/assets/default.jpg"));
    }
};

// GET PROFILE PAGE
getProfile = async (req, res) => {
    const user = await User.findById(req.cookies.userId).lean();
    res.render("profile", { user });
};

// CANCEL BOOKING
cancelBooking = async (req, res) => {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.redirect("/page/booking");
};

// SEND OTP
sendOtp = async (req, res) => {
    try {
        const { identifier } = req.body;

        const user = await User.findOne({ email: identifier });

        if (!user) {
            return res.render("forgetPassword", {
                error: "User not found",
                message: null
            });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save to DB
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        console.log("OTP:", otp);

        // SEND EMAIL
        await transporter.sendMail({
            from: `"JhatPat Services" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "Your OTP Code",
            html: `
                <div style="font-family: Arial; padding: 10px;">
                    <h2>Your OTP for Password Reset</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing: 5px; color: #fcbf49;">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                </div>
            `
        });
        transporter.verify((err, success) => {
            if (err) console.log("Email Error:", err);
            else console.log("Mailer Ready!");
        });


        return res.render("verifyOtp", {
            userId: user._id,
            email: user.email,    
            error: null
        });

    } catch (err) {
        console.log("OTP Error:", err);

        res.render("forgetPassword", {
            error: "Unable to send OTP. Try again.",
            message: null
        });
    }
};

// VERIFY OTP
verifyOtp = async (req, res) => {
    try {
        const { otp, userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.render("verifyOtp", {
                error: "User not found!",
                email: "",
                userId
            });
        }

        // ❌ Wrong OTP
        if (user.otp !== otp) {
            return res.render("verifyOtp", {
                error: "Invalid OTP! Please try again.",
                email: user.email,
                userId
            });
        }

        // ❌ Expired OTP
        if (Date.now() > user.otpExpiry) {
            return res.render("verifyOtp", {
                error: "OTP has expired. Please request again.",
                email: user.email,
                userId
            });
        }

        // ✅ Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.render("resetPassword", {
            userId: user._id,
            error: null,
        });

    } catch (err) {
        console.log("OTP verify error:", err);
        res.render("verifyOtp", {
            error: "Something went wrong!",
            email: "",
            userId: ""
        });
    }
};


// RESET PASSWORD
resetPassword = async (req, res) => {
    const { newPass, confirmPass, userId } = req.body;

    if (newPass !== confirmPass) return res.send("Passwords do not match");

    await User.findByIdAndUpdate(userId, {
        password: newPass,
        otp: null,
        otpExpiry: null
    });

    res.redirect("/page/login");
};

module.exports = { signup, login, logout, updateProfile, getProfilePic, getProfile, cancelBooking, sendOtp, verifyOtp, resetPassword };