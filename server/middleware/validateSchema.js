import { UserProfileSchema } from '#server/models/schema.user_profile.js';
import { TeamSchema } from '#server/models/schema.team.js'
import { MemberSchema, MemberInviteSchema } from '#server/models/schema.member.js'
import { TaskSchema, TaskCreationSchema } from '#server/models/schema.task.js'

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

export const validateMember = (req, res, next) => {
    try {
        MemberSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

export const validateTask = (req, res, next) => {
    try {
        TaskSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

export const validateTaskCreation = (req, res, next) => {
    try {
        TaskCreationSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid request body', details: error.errors });
    }
};

