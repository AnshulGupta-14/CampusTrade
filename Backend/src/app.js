import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: "Anshul", // Change this to a strong random secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", sameSite: "None" }, // Set to true if using https
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message, // Just send the error message
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
});

import userRouter from "./Routes/user.routes.js";
import productRouter from "./Routes/product.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

export { app };
