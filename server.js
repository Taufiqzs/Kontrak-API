// Import routes
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const infoRoutes = require("./routes/inforoutes");
const transactionRoutes = require("./routes/transactionroutes");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static("uploads"));

// Database connection (ganti bank_db menjadi kontrak_db)
// Remove: const mongoose = require('mongoose');
const { sequelize } = require("./models"); // We'll create this

// Replace the entire mongoose.connect block with:
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected via Sequelize"))
  .catch((err) => console.error("Connection error:", err));

// Sync database (use carefully in production)
sequelize
  .sync({ alter: true }) // In production, use migrations instead
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Sync error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/transaction", transactionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
