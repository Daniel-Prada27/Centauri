import { UserProfileSchema } from '#server/models/schema.user_profile.js';
import { TeamSchema } from '#server/models/schema.team.js'
import { MemberInviteSchema } from '#server/models/schema.member.js'

export const validateUserProfile = (req, res, next) => {
    try {
        UserProfileSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

export const validateTeam = (req, res, next) => {
    try {
        TeamSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

export const validateMemberInvite = (req, res, next) => {
    try {
        MemberInviteSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

