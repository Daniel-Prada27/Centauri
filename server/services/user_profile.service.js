import {PrismaClient} from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})


const prisma = new PrismaClient()

export const createUserProfile = async(userProfileData) => {
    console.log(userProfileData);
    const exists = await prisma.user.findUnique({
        where: {id: userProfileData.user_id}
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.create({data: userProfileData})

    return userProfile

}