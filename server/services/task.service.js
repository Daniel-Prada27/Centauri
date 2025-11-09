import { PrismaClient } from '#server/generated/prisma/client.ts'
import { createNotification, createTeamNotification } from '#server/services/notification.service.js'
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

const checkTaskExistence = async (taskId) => {
    const targetTask = prisma.task.findUnique({
        where: {
            id: taskId
        }
    })

    return targetTask
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

const getAssignedTaskNotification = (teamId, taskName) => {

    let currentDate = new Date();
    // currentDate = currentDate.toISOString().split('T')[0]

    const notification = {
        id_team: teamId,
        type: "Task",
        title: "New task assigned to you",
        message: `The task ${taskName} has been assigned to you`,
        creation_date: currentDate,
        read: false
    }

    return notification

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

    const notification = getAssignedTaskNotification(createdTask.id_team, createdTask.name)

    await createNotification(notification, [createdTask.id_responsible]);

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

export const updateTask = async (userId, taskId, task) => {

    console.log(task);

    const targetTask = await checkTaskExistence(taskId);

    if (!targetTask) {
        const error = new Error(`Task doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    if (targetTask.id_responsible !== userId) {
        const error = new Error(`Insufficient permission to modify task`);
        error.statusCode = 401;
        throw error
    }

    if (targetTask.id_responsible !== task.id_responsible) {

        console.log("entered");

        const userIsOwner = await isOwner(targetTask.id_team, userId);
        const userIsLeader = await isLeader(targetTask.id_team, userId);

        if (!userIsOwner && !userIsLeader) {
            const error = new Error(`Insufficient permission to change task responsible`);
            error.statusCode = 401;
            throw error
        }

    }


    if (!(await isResponsibleValid(task.id_team, task.id_responsible))) {
        const error = new Error(`Assigned responsible has insufficient permissions`);
        error.statusCode = 401;
        throw error
    }


    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
            name: task.name
        },
        data: task
    })
    updatedTask.due_date = updatedTask.due_date.toISOString().split('T')[0]
    console.log(updatedTask);

    const notification = getAssignedTaskNotification(updatedTask.id_team, updatedTask.name)

    await createNotification(notification, [updatedTask.id_responsible]);

    return updatedTask

}


export const deleteTask = async (userId, taskId) => {

    const targetTask = await checkTaskExistence(taskId);

    if (!targetTask) {
        const error = new Error(`Task doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    const userIsOwner = await isOwner(targetTask.id_team, userId);
    const userIsLeader = await isLeader(targetTask.id_team, userId);

    if (!userIsOwner && !userIsLeader) {
        const error = new Error(`Insufficient permission to delete task`);
        error.statusCode = 404;
        throw error
    }

    const deletedTask = await prisma.task.delete({
        where: {
            id: taskId,
        }
    })

    deletedTask.due_date = deletedTask.due_date.toISOString().split('T')[0]


    return deletedTask



}
