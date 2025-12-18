const express = require("express");
const router = express.Router();
const transactionscontrollers = require("../controllers/transactionscontroller");
const auth = require("../middleware/auth");

router.use(auth);

//  lokasi_route GET /api/transaction/balance
//  deskripsi Get account balance
//  akses Private
router.get("/balance", transactionscontrollers.getBalance);

// lokasi_route   POST /api/transaction/topup
// deskripsi Top up balance
// akses  Private
router.post("/topup", transactionscontrollers.topup);

// lokasi_route   POST /api/transaction/transaction
// deskripsi    Make a transaction
// akses  Private
router.post("/transaction", transactionscontrollers.makeTransaction);

// lokasi_route   GET /api/transaction/history
// deskripsi    Get transaction history
// akses  Private
router.get("/history", transactionscontrollers.getTransactionHistory);

module.exports = router;
