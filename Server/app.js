import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

import userRouter from "./src/routes/userRoutes.js";
import listRouter from "./src/routes/listRoutes.js";
import bookingRouter from "./src/routes/bookingRoutes.js";
import ratingRouter from "./src/routes/ratingRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import amenityRouter from "./src/routes/amenityRoutes.js";
import uploadRouter from "./src/data/upload.js";
import contactRouter from "./src/routes/contactUsRoutes.js";

import RAGRouter from "./src/routes/RAGChatBootRoutes.js";
import { swaggerDocs } from "./src/utilities/swagerDoc.js";
import cookieParser from "cookie-parser";
import { stripeWebhookHandler } from "./src/controllers/bookingControllers.js";
import chatRouter from "./src/routes/chatRoutes.js";
import { notFound } from "./src/middlewares/notFoundError.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

dotenv.config({ path: "./config.env" });
const app = express();

// connect to database
const DB_LOCAL = process.env.DB_LOCAL;
const DB_ATLAS = process.env.DB_ATLAS;
const DB = process.env.DB;
mongoose
  // .connect(DB_LOCAL)
  .connect(DB_ATLAS)
  // .connect(DB)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error while connected to DB");
  });

// Swager Docmintation
swaggerDocs(app);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

//general middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = ["http://localhost:5173", "https://maskn.netlify.app","http://localhost:4200"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like mobile apps or curl
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // only HTTPS in prod
      httpOnly: true,
      sameSite: "none", // allow cross-site cookies
    },
  })
);

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lists", listRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/ratings", ratingRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/chat-model", RAGRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/", uploadRouter);
app.use("/api/v1/contact", contactRouter);

//server

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app
  .listen(PORT, () => {
    console.log(`listining to server on port ${PORT}...`);
  })
  .on("error", (error) => {
    console.log("Error while starting server: ", error);
  });
