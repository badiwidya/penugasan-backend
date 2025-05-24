import { oauth2Client } from "../config/googleConfig.js";

// TODO: Tambahin redirect ke frontend

const SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.announcements",
    "https://www.googleapis.com/auth/classroom.topics",
    "https://www.googleapis.com/auth/classroom.courseworkmaterials",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.profile.emails",
    "https://www.googleapis.com/auth/classroom.profile.photos",
];

class AuthController {
    constructor() {
        this.oauth2Client = oauth2Client;
        this.SCOPES = SCOPES;

        this.redirectAuth = this.redirectAuth.bind(this);
        this.callbackHandler = this.callbackHandler.bind(this);
        this.logout = this.logout.bind(this);
    }

    redirectAuth(req, res) {
        try {
            const url = this.oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: this.SCOPES,
                prompt: "consent",
            });

            res.redirect(url);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            res.status(500).json({
                status: "failed",
                error: "Terjadi kesalahan " + error,
            });
        }
    }

    async callbackHandler(req, res) {
        const { code } = req.query;
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);

            req.session.tokens = tokens; // Simpen token di session
            res.redirect("http://localhost:5173");
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            res.status(500).json({
                status: "failed",
                error: "Terjadi kesalahan",
                error,
            });
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Terjadi kesalahan:", err);
                res.status(500).json({
                    status: "failed",
                    error: "Gagal saat mencoba logout",
                });
            } else {
                res.json({
                    status: "success",
                    message: "Logout berhasil",
                });
            }
        });

        res.redirect("http://localhost:5173");
    }
}

export default new AuthController();
