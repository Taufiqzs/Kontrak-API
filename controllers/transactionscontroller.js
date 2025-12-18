const { User, Transaction, Sequelize } = require("../models");

exports.getBalance = async (req, res) => {
  //Parameterized query by primary key
  const user = await User.findByPk(req.user.id, {
    attributes: ["balance", "accountNumber", "firstname", "lastname"],
  });
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
  const transactions = await Transaction.findAll({
    where: where,
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: offset,
  });
};
