import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);


const allowedOrigins = ["https://newnewsfrontend01.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins, // Only allow specific origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Required for cookies and authentication
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Product deployed");
});

// Connect to Database and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

export default app;

