const express = require("express");
const router = express.Router();
const planController = require("./planController");

// routes
router.get("/", planController.getPlans);
router.post("/", planController.createPlan);
router.delete("/:id", planController.deletePlan);

module.exports = router;