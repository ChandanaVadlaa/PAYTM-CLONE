const { Account } = require("../models/db");

const mongoose = require("mongoose");

// Get account balance
const balance = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }
    res.json({ balance: account.balance });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

// Transfer funds
const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { amount, to } = req.body;

  try {
    // Sender's account
    const senderAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!senderAccount) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "Sender account not found" });
    }

    // Check if sender has sufficient balance
    if (senderAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Deduct amount from sender's account
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    // Add amount to recipient's account
    const recipientAccount = await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);
    if (recipientAccount.nModified === 0) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "Recipient account not found" });
    }

    await session.commitTransaction();
    res.status(200).json({ msg: "Transfer successful" });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ msg: e.message });
  } finally {
    session.endSession();
  }
};

module.exports = { balance, transfer };
