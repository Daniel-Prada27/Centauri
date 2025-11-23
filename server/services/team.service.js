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

export const readTeam = async (userId) => {
    const teams = await prisma.team.findMany({
        where: {
            users: {
                some: {
                    id_user: userId,
                }
            }
        }
    })

    if (teams.length === 0) {
        const error = new Error(`You dont have any teams`);
        error.statusCode = 404;
        throw error
    }


    return teams
}

export const updateTeam = async (teamId, teamData) => {
    console.log(teamData);
    const exists = await prisma.team.findUnique({
        where: { id: teamId }
    })

    if (!exists) {
        const error = new Error(`Team doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const team = await prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            name: teamData.name || undefined,
            description: teamData.description || undefined
        }
    })

    return team

}

export const deleteTeam = async (userId, teamId) => {
    const exists = await prisma.team.findUnique({
        where: { id: teamId }
    })

    if (!exists) {
        const error = new Error(`Team doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    await prisma.member.delete({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "owner"

        }
    })

    const team = await prisma.team.delete({
        where: {
            id: teamId
        }
    })

    return team
}