import { UserProfileSchema } from '#server/models/schema.user_profile.js';

export const validateUserProfile = (req, res, next) => {
    try {
        UserProfileSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

