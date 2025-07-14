import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import animeRoutes from "./routes/anime.route.js";
import searchRoutes from "./routes/search.route.js";
import watchListRoutes from "./routes/watch.route.js";
import watchHistoryRoutes from "./routes/watchHistory.route.js";

import { envVars } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const PORT = envVars.PORT;
const __dirname = path.resolve();

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:8081", // For web
  "http://192.168.1.12:8081", // For Expo on phone
  "exp://192.168.1.12:8081",
  "http://192.168.1.12:19006", // Expo Go dev preview (adjust if needed)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", protectRoute, userRoutes);
app.use("/api/v1/anime", protectRoute, animeRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/watchlist", protectRoute, watchListRoutes);
app.use("/api/v1/watchhistory", protectRoute, watchHistoryRoutes);

if (envVars.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server stated " + PORT);
  connectDB();
});
