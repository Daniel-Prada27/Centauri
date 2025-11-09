import { PrismaClient } from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })


const prisma = new PrismaClient()

const checkTeamExistence = async (teamId) => {
    const exists = await prisma.team.findUnique({
        where: { id: teamId }
    })

    if (!exists) {
        const error = new Error(`Team doesn't exist`);
        error.statusCode = 404;
        throw error
    }
}

export const readAllMembers = async (teamId) => {

    const exists = checkTeamExistence(teamId)

    const members = await prisma.member.findMany({
        where: {
            id_team: teamId
        }
    })

    if (members.length === 0) {
        const error = new Error(`You dont have any teams`);
        error.statusCode = 404;
        throw error
    }

    return members
}
