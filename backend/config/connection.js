const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const JWT_SECRET = "secret";

let mongoServer;

// Connect to MongoDB in-memory server
const connectDB = async () => {
  try {
    // Create an in-memory MongoDB instance and start it
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    console.log(`Using in-memory MongoDB at: ${mongoUri}`);

    // Connect to the in-memory database
    const conn = await mongoose.connect(mongoUri);
    console.log(`Database connected successfully: ${conn.connection.host}`);

    return conn;
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

// Function to close the connection and stop the server
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

// Clean up the database between tests
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

module.exports = {
  dbconnect: connectDB,
  closeDatabase,
  clearDatabase,
  JWT_SECRET
};
