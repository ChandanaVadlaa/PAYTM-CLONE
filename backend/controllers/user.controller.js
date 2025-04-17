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
  try {
    const get = await User.find({});
    res.json(get);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const signup = async (req, res) => {
  const result = signupbody.safeParse(req.body);

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
      userId: user._id,
      balance: 1 + Math.random() * 10000,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    // Return the newly created user
    res.status(201).json({
      msg: "User created successfully!",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    // Handle other errors
    res.status(500).json({ message: e.message });
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
      user: {
        name: user.name,
        email: user.email,
      },
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
  password: z.string().min(8).max(50).optional(),
});

const update = async (req, res) => {
  // Validate input
  const result = updateBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid update data",
      errors: result.error.errors
    });
  }

  try {
    // If updating email, make sure it's not already in use
    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.userId }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Attempt to update the user
    const updated = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true, runValidators: true }
    );

    // Check if update succeeded
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        name: updated.name,
        email: updated.email,
      }
    });
  } catch (e) {
    console.error("Error during update:", e);
    return res.status(500).json({ message: "Server error during update" });
  }
};

const bulk = async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const users = await User.find(
      filter ? { name: { $regex: filter, $options: "i" } } : {}
    );

    res.json({
      users: users.map((user) => ({
        name: user.name,
        email: user.email,
        _id: user._id,
      })),
    });
  } catch (e) {
    res.status(500).json({ message: "Error fetching users", error: e.message });
  }
};

module.exports = { signup, signin, update, all, bulk };
