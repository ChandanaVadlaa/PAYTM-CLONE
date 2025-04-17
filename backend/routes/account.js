const express = require("express");

const router = express.Router();

const { balance, transfer } = require("../controllers/account.controller");

const auth = require("../middlewares/userAuth");

router.get("/balance", auth, balance);

router.post("/transfer", auth, transfer);

module.exports = router;
