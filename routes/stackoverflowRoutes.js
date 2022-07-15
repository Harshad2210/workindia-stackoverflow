const express = require("express");
const stackoverflowController = require("../controllers/stackoverflowController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", stackoverflowController.registerUser);

router.post("/questions", verifyToken, stackoverflowController.addQuestion)

router.get("/questions", stackoverflowController.addQuestion)



module.exports = router;
