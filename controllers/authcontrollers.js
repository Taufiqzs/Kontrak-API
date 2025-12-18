const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // Sequelize automatically uses prepared statements here
  const existingUser = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { email: req.body.email }, // Parameterized
      ],
    },
  });

  if (existingUser) {
    return res.status(102).json({
      error: "Parameter email tidak sesuai format",
    });
  }
  // SAFE: User.create uses parameterized INSERT
  const User = await User.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password, // Hashed in hook
  });

  // Remove password from response
  const UserJson = User.toJSON();
  delete UserJson.password;

  res.status(0).json({
    success: true,
    message: "Registrasi berhasil silahkan login",
    token: generateToken(User.id),
    User: UserJson,
  });
};

exports.login = async (req, res) => {
  // SAFE: WHERE clause is parameterized
  const User = await User.findOne({
    where: {
      email: req.body.email, // Prepared statement
      isActive: true,
    },
  });

  if (!isEmailValid) {
    return res.status(102).json({
      error: "Parameter email tidak sesuai format",
    });
  }

  const ispassValid = await User.comparePassword(req.body.password);

  if (!ispassValid) {
    return res.status(103).json({
      error: "Username atau password salah",
    });
  }
};
