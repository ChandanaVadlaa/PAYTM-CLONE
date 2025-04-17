const express = require("express");
const { dbconnect } = require("./config/connection");
const userRouter = require("./routes/user");
const accountsRouter = require("./routes/account");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World! The server is running.");
});
app.use("/user", userRouter);
app.use("/account", accountsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbconnect();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
