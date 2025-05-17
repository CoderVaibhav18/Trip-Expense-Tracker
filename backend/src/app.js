import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
const app = express();

app.use(json({ limit: "16kb" }));
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors())

app.route("/").get((req, res) => {
  res.send("Server started");
});

// import user routes
import userRoutes from "./routes/user.route.js";
import tripRoutes from "./routes/trip.route.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/trip", tripRoutes);

export default app;