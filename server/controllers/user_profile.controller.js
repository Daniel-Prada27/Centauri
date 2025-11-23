import * as userProfileService from '#server/services/user_profile.service.js'
import { UserProfileSchema } from '#server/models/schema.user_profile.js'
import { authClient } from '#server/lib/auth-client.js'


export const addUserProfile = async (req, res) => {
    try {

        const userProfile = UserProfileSchema.parse(req.body)
        const userId = req.session.user.id

        console.log(userProfile);
        userProfile.user = {
            connect: {
                id: userId
            }
        }
        console.log(userProfile);

        const result = await userProfileService.createUserProfile(userId, userProfile)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readUserProfile = async (req, res) => {
    try {
        const userId = req.session.user.id
        const result = await userProfileService.readUserProfile(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readWholeUser = async (req, res) => {
    try {
        const userId = req.session.user.id
        const result = await userProfileService.readWholeUser(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readUserProfileById = async (req, res) => {
    try {
        // const userProfile = req.body
        const userId = req.params.id
        console.log(userId);
        const result = await userProfileService.readUserProfileById(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readUserByEmail = async (req, res) => {
    try {
        // const userProfile = req.body
        const userEmail = req.body.user_email
        console.log(userEmail);
        const result = await userProfileService.readUserByEmail(userEmail)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userProfile = req.body
        const userId = req.session.user.id

        const result = await userProfileService.updateUserProfile(userId, userProfile)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.session.user.id
        const result = await userProfileService.deleteUserProfile(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}
