const { User, Account } = require("../models/db");

const { JWT_SECRET } = require("../config/connection");

const z = require("zod");

const jwt = require("jsonwebtoken");

const signupbody = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

const signinbody = z.object({
  email: z.string().email(),
  password: z.string(),
});

const all = async (req, res) => {
  const get = await User.find({});
  res.json(get);
};

const signup = async (req, res) => {
  const result = signupbody.safeParse(req.body);

  // Check if validation failed
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid credentials", errors: result.error.errors });
  }

  // Extract validated data
  const { name, password, email } = result.data;

  try {
    // Check if the user already exists
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    // Create the new user
    const user = await User.create({ name, password, email });

    // Initialize balance and create an Account for the user
    await Account.create({
      userId: user._id, // Use the newly created user's ID
      balance: 1 + Math.random() * 10000,
    });

    // Optional: generate JWT token here if needed
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // Return the newly created user
    res.status(201).json({ msg: "User created successfully!", token });
  } catch (e) {
    // Handle other errors
    res.status(400).json({ message: e.message });
  }
};

const signin = async (req, res) => {
  // Validate request body using Zod schema
  const result = signinbody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid credentials",
      errors: result.error.errors,
    });
  }

  const { email, password } = result.data;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Your account doesn't exist!" });
    }

    // Verify password
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // Return success response with token
    return res.status(200).json({
      message: "You are logged in successfully",
      token,
    });
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateBody = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

const update = async (req, res) => {
  console.log("User ID from token:", req.userId);
  console.log("Request Body:", req.body);

  // Validate input
  const result = updateBody.safeParse(req.body);
  if (!result.success) {
    console.log("Validation Error:", result.error);
    return res.status(400).json({ msg: "Error in credentials!" });
  }

  try {
    // Attempt to update the user
    const updated = await User.updateOne({ _id: req.userId }, req.body);

    // Check if update succeeded
    if (updated.nModified === 0) {
      console.log("No changes made or user not found");
      return res.status(404).json({ msg: "User not found or no changes made" });
    }

    // Retrieve the updated user
    const updatedUser = await User.findById(req.userId);
    console.log("Updated User:", updatedUser); // Log to see the returned document

    // Check if updatedUser is null
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found after update" });
    }

    // Send the updated user data in the response
    return res.status(200).json(updatedUser);
  } catch (e) {
    console.error("Error during update:", e); // Log error details
    return res.status(500).json({ message: "Server error during update" });
  }
};

const bulk = async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const users = await User.find({
      name: { $regex: filter, $options: "i" }, // Use `name` field for case-insensitive partial match
    });

    res.json({
      users: users.map((user) => ({
        username: user.username,
        name: user.name, // Return the `name` field instead of `firstName` and `lastName`
        email: user.email,
        _id: user._id,
      })),
    });
  } catch (e) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const del = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const user = await User.create({ name, password, email });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { signup, signin, update, all, bulk }; // Change 'modules.export' to 'module.exports'
