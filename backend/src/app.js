import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(json({ limit: "16kb" }));
app.use(urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());

app.route("/").get((req, res) => {
  res.send("Server started");
});

// import user routes
import userRoutes from "./routes/user.route.js";
import tripRoutes from "./routes/trip.route.js";
import expenseRoutes from "./routes/expense.route.js";
import balanceRoutes from "./routes/balance.route.js";
import repaymentRoutes from "./routes/repayment.route.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/trip", tripRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/balance", balanceRoutes);
app.use("/api/v1/repayment", repaymentRoutes);

export default app;
