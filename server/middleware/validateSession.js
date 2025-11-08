import { auth } from "#server/lib/auth.js";

export const validateSession = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (session) {
            req.session = session;
            next();
        } else {
            return res.status(401).json({ message: "No valid session found." });
        }
    } catch (error) {
        console.error("Error retrieving session:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
