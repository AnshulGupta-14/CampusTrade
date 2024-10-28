import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";

const app = express();
const RedisStore = connectRedis(session);

const redisClient = createClient({
  password: "ann6p20z4VImosJXAin068qGqQs5u2YD",
  socket: {
    host: "redis-13185.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 13185,
  },
});

await redisClient.connect().catch(console.error);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Set true if using HTTPS in production
      sameSite: "None", // Adjust for cross-origin if needed
      httpOnly: true, // Protects cookie from JavaScript access
    },
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
