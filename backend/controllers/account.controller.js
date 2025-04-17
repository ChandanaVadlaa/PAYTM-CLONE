const { Account } = require("../models/db");
const mongoose = require("mongoose");
const z = require("zod");

// Transfer schema validation
const transferSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  to: z.string().min(1, "Recipient ID is required")
});

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
  // Validate the request body
  const result = transferSchema.safeParse({
    amount: Number(req.body.amount),
    to: req.body.to
  });

  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid transfer data",
      errors: result.error.errors
    });
  }

  const { amount, to } = result.data;

  // Check that user isn't sending money to themselves
  if (to === req.userId.toString()) {
    return res.status(400).json({ msg: "Cannot transfer to your own account" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Sender's account
    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: "Sender account not found" });
    }

    // Check if sender has sufficient balance
    if (senderAccount.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Recipient's account
    const recipientAccount = await Account.findOne({ userId: to }).session(session);
    if (!recipientAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: "Recipient account not found" });
    }

    // Update accounts
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ msg: "Transfer successful" });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ msg: e.message });
  }
};

module.exports = { balance, transfer };
