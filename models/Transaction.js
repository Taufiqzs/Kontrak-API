"use strict";

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: function () {
          return "TRX" + Date.now().toString().slice(-12);
        },
      },
      type: {
        type: DataTypes.ENUM("TOPUP", "TRANSFER", "PAYMENT", "WITHDRAWAL"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      description: DataTypes.STRING,
      recipientAccount: DataTypes.STRING,
      recipientName: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "SUCCESS",
      },
      balanceBefore: DataTypes.DECIMAL(15, 2),
      balanceAfter: DataTypes.DECIMAL(15, 2),
    },
    {
      timestamps: true,
      tableName: "transactions",
    }
  );

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Transaction;
};
