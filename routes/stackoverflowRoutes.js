const express = require("express");
const stackoverflowController = require("../controllers/stackoverflowController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", stackoverflowController.registerUser);

router.post("/users/:uid/block", stackoverflowController.blockUser);

router.post("/users/:uid/block", stackoverflowController.unblockUser);

router.post("/questions", verifyToken, stackoverflowController.addQuestion)

router.get("/questions", stackoverflowController.getQuestions)

router.get("/questions", stackoverflowController.getQuestions)

router.get("/questions/:qid/block", stackoverflowController.blockQuestion)

router.get("/questions/:qid/unblock", stackoverflowController.unblockQuestion)

router.post("/questions/:qid/answers", stackoverflowController.addAnwers)

router.post("/questions/:qid/answers/block", stackoverflowController.blockAnswer)

router.post("/questions/:qid/answers/unblock", stackoverflowController.unblockAnswer)


module.exports = router;
