const multer = require("multer");

const storage = multer.memoryStorage(); //  RAM → Buffer

module.exports = multer({ storage });
