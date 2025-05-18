import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import db from './config/db.js'
const PORT = process.env.PORT;
import app from "./app.js";

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
