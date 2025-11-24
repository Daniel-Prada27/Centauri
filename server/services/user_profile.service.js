import { PrismaClient } from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })


const prisma = new PrismaClient()

export const createUserProfile = async (userId, userProfileData) => {
    console.log(userProfileData);
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.create({ data: userProfileData })

    return userProfile

}

export const readUserProfile = async (userId) => {
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.findUnique({
        where: {
            user_id: userId
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            }
        }
    })

    return userProfile
}

export const readWholeUser = async (userId) => {
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            profile: true
        }
    })

    return userProfile
}

export const readUserProfileById = async (userId) => {
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.findUnique({
        where: {
            user_id: userId
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            }
        }
    })

    return userProfile
}

export const readUserByEmail = async (userEmail) => {
    const user = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
        include: {
            profile: true
        }
    })

    if (!user) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    return user
}

export const updateUserProfile = async (userId, userProfileData) => {
    console.log(userProfileData);
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.update({
        where: {
            user_id: userId
        },
        data: {
            occupation: userProfileData.occupation || undefined,
            location: userProfileData.location || undefined,
            picture: userProfileData.picture || undefined
        }
    })

    return userProfile

}

export const deleteUserProfile = async (userId) => {
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    return userProfile
}