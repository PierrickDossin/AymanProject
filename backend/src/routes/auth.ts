import { Router } from "express";
import passport from "../config/passport.js";

const router = Router();

// Google OAuth - Initiate
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

// Google OAuth - Callback
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:8080"}/login?error=auth_failed`,
        session: false
    }),
    (req, res) => {
        // Successful authentication
        const user = req.user as any;

        // Store user in a temporary token or session
        // For simplicity, we'll redirect with user data in URL (in production, use JWT)
        const userData = encodeURIComponent(JSON.stringify({
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }));

        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:8080"}/auth/callback?user=${userData}`);
    }
);

// Facebook OAuth (placeholder for future implementation)
router.get("/facebook", (req, res) => {
    res.status(501).json({ error: "Facebook OAuth not yet implemented" });
});

// Apple OAuth (placeholder for future implementation)
router.get("/apple", (req, res) => {
    res.status(501).json({ error: "Apple OAuth not yet implemented" });
});

export default router;
