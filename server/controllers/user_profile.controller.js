import * as userProfileService from '#server/services/user_profile.service.js'
import { UserProfileSchema } from '#server/models/schema.user_profile.js'
import { authClient } from '#server/lib/auth-client.js'


export const addUserProfile = async (req, res) => {
    try {

        const userProfile = UserProfileSchema.parse(req.body)

        const result = await userProfileService.createUserProfile(userProfile)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readUserProfile = async (req, res) => {
    try {
        const result = await userProfileService.readUserProfile(req.body)
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

        const result = await userProfileService.updateUserProfile(userProfile)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const deleteUserProfile = async (req, res) => {
    try {
        const result = await userProfileService.deleteUserProfile(req.body)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}
