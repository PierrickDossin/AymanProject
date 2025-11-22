import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserService } from "../application/services/UserService";
import { TypeOrmUserRepository } from "../infrastructure/persistence/TypeOrmUserRepository";

console.log('🔍 Environment check - GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);

const userRepo = new TypeOrmUserRepository();
const userService = new UserService(userRepo);

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('🔐 Google OAuth configured with Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Extract email from Google profile
                    const email = profile.emails?.[0]?.value;
                    if (!email) {
                        return done(new Error("No email found in Google profile"), undefined);
                    }

                    // Check if user exists
                    let user = await userService.getUserByEmail(email);

                    if (!user) {
                        // Create new user from Google profile
                        const names = profile.displayName?.split(" ") || ["Google", "User"];
                        user = await userService.createUser({
                            email,
                            username: profile.emails?.[0]?.value.split("@")[0] || `user_${Date.now()}`,
                            firstName: names[0] || "Google",
                            lastName: names.slice(1).join(" ") || "User",
                            password: Math.random().toString(36).slice(-12), // Random password (won't be used)
                        });
                    }

                    done(null, user);
                } catch (error) {
                    done(error as Error, undefined);
                }
            }
        )
    );
} else {
    console.log('⚠️  Google OAuth NOT configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

export default passport;
