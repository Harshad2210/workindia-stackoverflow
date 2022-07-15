const express = require("express");
const stackoverflowController = require("../controllers/stackoverflowController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", stackoverflowController.registerUser);

router.post("/users/:uid/block", verifyToken, stackoverflowController.blockUser);

router.post("/users/:uid/unblock",verifyToken, stackoverflowController.unblockUser);

router.post("/questions", verifyToken, stackoverflowController.addQuestion)

router.get("/questions", stackoverflowController.getQuestions)

router.get("/questions/:qid/block", stackoverflowController.blockQuestion)

router.get("/questions/:qid/unblock", verifyToken, stackoverflowController.unblockQuestion)

router.post("/questions/:qid/answers",verifyToken, stackoverflowController.addAnwers)

router.post("/questions/:qid/answers/block",verifyToken, stackoverflowController.blockAnswer)

router.post("/questions/:qid/answers/unblock",verifyToken, stackoverflowController.unblockAnswer)


module.exports = router;
