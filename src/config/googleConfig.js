import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Environment variabel tidak terbaca");
}

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const classroom = google.classroom({ version: "v1", auth: oauth2Client });
const sheets = google.sheets({ version: "v4", auth: oauth2Client });

export { oauth2Client, classroom, sheets };