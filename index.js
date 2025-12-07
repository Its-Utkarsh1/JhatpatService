require("dotenv").config();
const path = require("path");
const express = require("express");
const connectToDB =  require("./connect");
const cookieParser = require("cookie-parser");
const pageRouter = require("./router/page");
const userRouter = require("./router/user");
const serviceRouter = require("./router/service");
const bookingRouter = require("./router/booking");
const providerRouter = require("./router/provider");
const auth = require("./middleware/auth");


//Express
const app = express();
const PORT = process.env.PORT || 4567;

//View Engine
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

//Body Parser
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//Middlewares
app.use(auth);


//Initial Routes
app.get("/", (req, res) => {
    res.render("splash", {
        user: res.locals.user || null
    });
});

app.get("/forgetPassword",(req,res)=>{ res.render("forgetPassword", {error: null, message: null});});

//Main Routers
app.use("/page", pageRouter);
app.use("/user", userRouter);
app.use("/service",serviceRouter);
app.use("/provider",providerRouter);
app.use("/booking",bookingRouter);


//DB+Server Start
connectToDB(process.env.MONGO_URL)
.then(()=>{
    console.log("Connect to DB");
    app.listen(PORT, ()=>{{
        console.log(`Server running at http://localhost:${PORT}`);
    }});
})
.catch((err) => console.log("Mongo connection error", err)); 