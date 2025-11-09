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

const checkUserExistence = async (userId) => {
    const exists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!exists) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error
    }
}

const checkMemberExistence = async (teamId, userId) => {
    const exists = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                userId: userId
            }
        }
    })

    if (!exists) {
        const error = new Error(`Member already on the team`);
        error.statusCode = 409;
        throw error
    }
}

const checkInviteExistence = async (teamId, userId) => {

    const exists = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "pending"
        }
    })

    if (exists) {
        const error = new Error(`User already invited`);
        error.statusCode = 409;
        throw error
    }
}

export const inviteMember = async (userId, member) => {

    const teamId = member.id_team
    const invitedUserId = member.id_user

    if (invitedUserId == userId) {
        const error = new Error(`Cant invite yourself to a team`);
        error.statusCode = 400;
        throw error
    }

    await checkTeamExistence(teamId);
    await checkUserExistence(invitedUserId);
    await checkInviteExistence(teamId, invitedUserId);

    const owner = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "owner"

        }
    })

    if (!owner) {
        const error = new Error(`Only the team owner can invite other users`);
        error.statusCode = 401;
        throw error
    }

    const invitedMember = await prisma.member.create({
        data: {
            id_team: teamId,
            id_user: invitedUserId,
            role: "pending"
        }
    })

    return invitedMember

}

export const acceptInvite = async () => {

}

export const readAllMembers = async (teamId) => {

    await checkTeamExistence(teamId)

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
