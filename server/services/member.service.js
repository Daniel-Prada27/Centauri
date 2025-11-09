import { PrismaClient } from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })


const prisma = new PrismaClient()

const isOwner = async (teamId, userId) => {
    const exists = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "owner"
        }
    })

    if (exists) {
        return true
    }

    return false
}

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
                id_user: userId
            },
            role: {
                not: "pending"
            }
        }
    })

    return exists

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

    return exists
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
    const memberExists = await checkMemberExistence(teamId, invitedUserId)
    const inviteExists = await checkInviteExistence(teamId, invitedUserId);

    if (memberExists) {
        const error = new Error(`Member already on the team`);
        error.statusCode = 409;
        throw error
    }

    if (inviteExists) {
        const error = new Error(`User already invited`);
        error.statusCode = 409;
        throw error
    }

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

export const acceptInvite = async (userId, member) => {

    const teamId = member.id_team
    const invitedUserId = member.id_user

    if (invitedUserId !== userId) {
        const error = new Error(`User id does not match invited user id`);
        error.statusCode = 400;
        throw error
    }
    await checkTeamExistence(teamId);
    await checkUserExistence(invitedUserId);

    const inviteExists = await checkInviteExistence(teamId, invitedUserId);

    if (!inviteExists) {
        const error = new Error(`Invite already resolved`);
        error.statusCode = 409;
        throw error
    }

    const updatedInvite = await prisma.member.update({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            }
        },
        data: {
            role: "viewer"
        }
    })


    return updatedInvite


}

export const rejectInvite = async (userId, member) => {

    const teamId = member.id_team
    const invitedUserId = member.id_user

    if (invitedUserId !== userId) {
        const error = new Error(`User id does not match invited user id`);
        error.statusCode = 400;
        throw error
    }
    await checkTeamExistence(teamId);
    await checkUserExistence(invitedUserId);

    const inviteExists = await checkInviteExistence(teamId, invitedUserId);

    if (!inviteExists) {
        const error = new Error(`Invite already resolved`);
        error.statusCode = 409;
        throw error
    }

    const updatedInvite = await prisma.member.delete({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "pending"
        }
    })


    return updatedInvite

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


export const updateMember = async (userId, member) => {

    const teamId = member.id_team
    const targetUserId = member.id_user
    const role = member.role

    if (!await isOwner(teamId, userId)) {
        const error = new Error(`Only team owner can update members`);
        error.statusCode = 401;
        throw error
    }

    await checkTeamExistence(teamId);
    const memberExists = await checkMemberExistence(teamId, targetUserId)

    if (!memberExists) {
        const error = new Error(`Member not found`);
        error.statusCode = 404;
        throw error
    }

    const updatedInvite = await prisma.member.update({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: targetUserId
            }
        },
        data: {
            role: role
        }
    })


    return updatedInvite


}