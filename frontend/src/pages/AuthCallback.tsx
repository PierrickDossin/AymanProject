import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
    const navigate = useNavigate();
    const { socialSignIn } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get user data from URL parameters
                const params = new URLSearchParams(window.location.search);
                const userDataString = params.get("user");

                if (!userDataString) {
                    throw new Error("No user data received");
                }

                const userData = JSON.parse(decodeURIComponent(userDataString));

                // Store user in auth context
                localStorage.setItem("user", JSON.stringify(userData));
                window.dispatchEvent(new Event("storage")); // Trigger auth context update

                // Redirect to home
                navigate("/");
            } catch (error) {
                console.error("OAuth callback error:", error);
                navigate("/login?error=callback_failed");
            }
        };

        handleCallback();
    }, [navigate, socialSignIn]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
