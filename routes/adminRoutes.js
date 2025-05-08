const express = require("express");
const router = express.Router();
const { updateUserRole } = require("../controllers/adminController");

router.post("/update-role", updateUserRole); // Route për përditësimin e rolit

module.exports = router;
