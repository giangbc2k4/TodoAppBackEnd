import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./libs/db.js";

import authRoute from "./routes/authRoute.js";
import taskrouters from "./routes/taskrouters.js";
import { protectedRoute } from "./middlewares/authmiddlewares.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

//middle
app.use(express.json());

//pub
app.use("/api/auth", authRoute);

//pri
app.use(protectedRoute);
app.use("/api/tasks", taskrouters);

connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Server dang chay tren : http://localhost:5001/");
  });
});
export default app;
