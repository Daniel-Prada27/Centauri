import { PrismaClient } from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })


const prisma = new PrismaClient()

export const createTeam = async (userId, teamData) => {
    console.log(teamData);
    const teams = await prisma.team.findMany({
        where: {
            name: teamData.name,
            users: {
                some: {
                    id_user: userId,
                    role: "owner"
                }

            }
        }
    })


    if (teams.length !== 0) {
        const error = new Error(`You already own a team with that name`);
        error.statusCode = 404;
        throw error
    }

    const team = await prisma.team.create({ data: teamData })
    const owner_member = await prisma.member.create({
        data: {
            id_user: userId,
            id_team: team.id,
            role: "owner"
        }
    })

    return team

}
