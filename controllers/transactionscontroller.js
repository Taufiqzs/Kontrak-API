const { User, Transaction, Sequelize } = require("../models");

exports.getBalance = async (req, res) => {
  //Parameterized query by primary key
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["balance", "accountNumber", "firstname", "lastname"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get balance" });
  }
};

exports.topup = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    //SELECT FOR UPDATE with parameterized WHERE
    const user = await User.findByPk(req.user.id, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    const balanceBefore = parseFloat(user.balance);
    const amount = parseFloat(req.body.amount);

    // update with parameterized SET
    await user.update(
      {
        balance: Sequelize.literal(`balance + ${amount}`),
      },
      { transaction: t }
    );

    // Parameterized INSERT
    const transaction = await Transaction.create(
      {
        userId: user.id,
        type: "TOPUP",
        amount: amount,
        description: req.body.description || "Top up",
        balanceBefore: balanceBefore,
        balanceAfter: parseFloat(user.balance) + amount,
      },
      { transaction: t }
    );

    await t.commit(); // Commit transactions
    // success
  } catch (error) {
    await t.rollback(); // Rollback
    // error
  }
};

exports.getTransactionHistory = async (req, res) => {
  const { page = 1, limit = 10, type } = req.query;
  const offset = (page - 1) * limit;

  // Build parameterized WHERE clause
  const where = { userId: req.user.id };
  if (type) where.type = type; // Parameterized

  if (req.query.startDate || req.query.endDate) {
    where.createdAt = {};
    if (req.query.startDate) {
      where.createdAt[Sequelize.Op.gte] = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      where.createdAt[Sequelize.Op.lte] = new Date(req.query.endDate);
    }
  }

  // findAll with parameterized conditions
  const transaction = await Transaction.findAll({
    where: where,
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: offset,
  });
};

exports.makeTransaction = async (req, res) => {
  try {
    const { type, amount, recipientAccount, recipientName, description = "Transaction" } = req.body;

    if (!["TRANSFER", "PAYMENT"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const balanceBefore = parseFloat(user.balance);
    const amountNum = parseFloat(amount);

    user.balance = balanceBefore - amountNum;
    await user.save();

    const transaction = await Transaction.create({
      userId: user.id,
      type,
      amount: amountNum,
      description,
      recipientAccount,
      recipientName,
      balanceBefore,
      balanceAfter: user.balance,
    });

    res.json({
      success: true,
      message: "Transaction successful",
      transactionId: transaction.transactionId,
      amount: amountNum,
      newBalance: user.balance,
      recipientAccount,
      recipientName,
      timestamp: transaction.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Transaction failed" });
  }
};

module.exports = {
  getBalance,
  topup,
  makeTransaction,
  getTransactionHistory,
};
