const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    deleteService,
    createService,
    getServiceDetails,
    getServiceImage
} = require("../controller/service");

// CREATE SERVICE
router.post("/create", upload.single("image"), createService);

//DELETE A SERVICE
router.post("/delete/:id", deleteService);

// SINGLE SERVICE DETAILS 
router.get("/details/:id", getServiceDetails);

// SERVICE IMAGE
router.get("/image/:id", getServiceImage);

module.exports = router;
