import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";
import * as routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./routes/notfound.js";

//connect to MongoDB, Cloudinary
connectDB();
initCloudinary();

//initialize express app
const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

//routes
app.use("/api/v1/auth", routes.authRoute);
app.use("/api/v1/category", routes.categoryRoute);
app.use("/api/v1/file", routes.fileRoute);
app.use("/api/v1/post", routes.postRoute);

//not found route
app.use(notFound);

//error handling middleware
app.use(errorHandler);

export default app;
