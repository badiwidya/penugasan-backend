import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import errorHandler from "./utils/errorHandler.js";

import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
