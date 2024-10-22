import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server listening on ${process.env.PORT}/${process.env.DB_NAME}`);
    });
  })
  .catch((err) => {
    console.log("Error listening", err);
  });
