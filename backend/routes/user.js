const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  update,
  all,
  bulk,
} = require("../controllers/user.controller");

const auth = require("../middlewares/userAuth");

// GET route to check if the server is working
router.get("/", auth, all);

// POST route for user signup
router.post("/signup", signup);

// POST route for user signin
router.post("/signin", signin);

//get filtered users

router.get("/bulk", auth, bulk);

// PUT route for updating user information
router.put("/update", auth, update);

module.exports = router; // Export the router
