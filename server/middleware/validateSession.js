import { auth } from "#server/lib/auth.js";




export const validateSession = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            return res.status(401).json({ message: "No valid session found." });
        }

        console.log(session.session.userId);
        const userId = session.session.userId
        session.session.accessToken = ''

        try {
            const { accessToken } = await auth.api.getAccessToken({
                body: {
                    providerId: "google", // or any other provider id
                    // accountId: "accountId", // optional, if you want to get the access token for a specific account
                    userId: userId, // optional, if you don't provide headers with authenticated token
                },
            })

            session.session.accessToken = accessToken
        } catch {
            console.log();
        }


        console.log("HERE");

        // console.log("GOT IT");




        req.session = session;
        req.user_id = session.user.id;
        req.user = session.user;
        next();

    } catch (error) {
        console.error("Error retrieving session:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
