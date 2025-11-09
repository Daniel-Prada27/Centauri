import { PrismaClient } from '#server/generated/prisma/client.ts'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })


const prisma = new PrismaClient()

const isLeader = async (teamId, userId) => {
    const exists = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: "leader"
        }
    })

    if (exists) {
        return true
    }

    return false
}

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

const isResponsibleValid = async (teamId, userId) => {
    const exists = await prisma.member.findUnique({
        where: {
            id_user_id_team: {
                id_team: teamId,
                id_user: userId
            },
            role: {
                notIn: ["pending", "viewer"]
            }
        }
    })

    if (exists) {
        return true
    }

    return false

}

export const createTask = async (userId, task) => {
    console.log(task);

    const teamId = task.id_team

    if (!(await isLeader(teamId, userId)) && !(await isOwner(teamId, userId))) {
        const error = new Error(`Insufficient permission to create tasks`);
        error.statusCode = 401;
        throw error
    }

    const tasks = await prisma.task.findMany({
        where: {
            name: task.name,
            id_team: teamId,
        }
    })


    if (tasks.length !== 0) {
        const error = new Error(`A task with that name already exists`);
        error.statusCode = 409;
        throw error
    }

    if (!(await isResponsibleValid(teamId, task.id_responsible))) {
        const error = new Error(`Assigned responsible has insufficient permissions`);
        error.statusCode = 401;
        throw error
    }


    const createdTask = await prisma.task.create({ data: task })
    createdTask.due_date = createdTask.due_date.toISOString().split('T')[0]
    console.log(createdTask);

    return createdTask

}

export const readTasks = async (teamId) => {
    await checkTeamExistence(teamId)

    const members = await prisma.task.findMany({
        where: {
            id_team: teamId
        }
    })

    return members
}
