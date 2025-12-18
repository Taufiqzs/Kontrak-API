const express = require("express");
const router = express.Router();
const transactionscontroller = require("../controllers/transactionscontroller");
const auth = require("../middleware/auth");

router.use(auth);

//  lokasi_route GET /api/transaction/balance
//  deskripsi Get account balance
//  akses Private
router.get("/balance", transactionscontroller.getBalance);

// lokasi_route   POST /api/transaction/topup
// deskripsi Top up balance
// akses  Private
router.post("/topup", transactionscontroller.topup);

// lokasi_route   POST /api/transaction/transaction
// deskripsi    Make a transaction
// akses  Private
router.post("/transaction", transactionscontroller.makeTransaction);

// lokasi_route   GET /api/transaction/history
// deskripsi    Get transaction history
// akses  Private
router.get("/history", transactionscontroller.getTransactionHistory);

module.exports = router;
