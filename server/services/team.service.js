import {PrismaClient} from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})


const prisma = new PrismaClient()

export const createTeam = async(teamData) => {
    console.log(teamData);
    const exists = await prisma.team.findUnique({
        where: {id: teamData.user_id}
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userProfile = await prisma.user_Profile.create({data: teamData})

    return userProfile

}
