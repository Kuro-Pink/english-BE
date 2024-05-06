const express = require("express");
const router = express.Router();

const authensController = require("../app/controllers/AuthensController");

router.get("/register", authensController.register);
router.get("/login", authensController.login);

router.post("/store", authensController.store);
router.post("/signin", authensController.signin);

router.get("/logout", authensController.logout);

module.exports = router;
