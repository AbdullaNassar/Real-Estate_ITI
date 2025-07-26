import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "./src/routes/userRoutes.js";
import listRouter from "./src/routes/listRoutes.js";
import bookingRouter from "./src/routes/bookingRoutes.js";
import ratingRouter from './src/routes/ratingRoutes.js';
import categoryRouter from './src/routes/categoryRoutes.js';
import amenityRouter from './src/routes/amenityRoutes.js';
import { swaggerDocs } from "./src/utilities/swagerDoc.js";

dotenv.config({ path: "./config.env" });
const app = express();
const port = process.env.PORT;

// connect to database
const DB_LOCAL = process.env.DB_LOCAL;
const DB = process.env.DB;
console.log(DB);
mongoose
  // .connect(DB)
  .connect(DB_LOCAL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error while connected to DB");
  });

// Swager Docmintation
swaggerDocs(app);

//general middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lists", listRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/ratings", ratingRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/amenities", amenityRouter);


//server
app
  .listen(port, () => {
    console.log("listining to server...");
  })
  .on("error", (error) => {
    console.log("Error while starting server: ", error);
  });
