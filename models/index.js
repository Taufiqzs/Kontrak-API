"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

console.log("Environment:", env);
console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);

const db = {};

let sequelize;

if (process.env.DATABASE_URL) {
  console.log("Using DATABASE_URL from environment");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Use local config (Development)
  console.log("💻 Using local config");
  const config = require(__dirname + "/../config/config.json")[env];
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port || 5432,
    dialect: "postgres",
    logging: false,
  });
}

// Test connection
sequelize
  .authenticate()
  .then(() => console.log(" Database connected successfully"))
  .catch((err) => {
    console.error(" Database connection failed:", err.message);
    console.error("DATABASE_URL was:", process.env.DATABASE_URL ? "Set" : "Not set");
    if (process.env.NODE_ENV !== "production") {
      console.error("Full error:", err);
    }
  });

// Load models
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && !file.includes(".test.js");
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
