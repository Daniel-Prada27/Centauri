import { auth } from "#server/lib/auth.js";

export const validateSession = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session || !session.user) {
            return res.status(401).json({ message: "No valid session found." });
        }

        req.session = session;
        req.user_id = session.user.id;     
        req.user = session.user;           

        next();
        
    } catch (error) {
        console.error("Error retrieving session:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
