import { PrismaClient } from '#server/generated/prisma/client.ts'
import { readAllMembers } from '#server/services/member.service.js'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const prisma = new PrismaClient()

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

const checkNotificationExistence = async (notificationId) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
    })

    if (!notification) {
        const error = new Error(`Notification doesn't exist`);
        error.statusCode = 404;
        throw error
    }

    return notification
}

export const createNotification = async (data, recipients) => {

    const notification = await prisma.notification.create({ data })

    const notificationMembers = recipients.map(userId => (
        {
            id_member: userId,
            id_notification: notification.id,
            read: false
        }
    ))

    await prisma.notificationMember.createManyAndReturn({
        data: notificationMembers
    })

    return notification

}

export const createTeamNotification = async (data) => {

    const notification = await prisma.notification.create({ data })

    const members = await readAllMembers(notification.id_team)

    const notificationMembers = members.map(member => (
        {
            id_user: member.id_user,
            id_notification: notification.id,
            read: false
        }
    ))

    await prisma.notificationMember.createManyAndReturn({
        data: notificationMembers
    })

    return notification

}

export const readNotifications = async (userId) => {

    await checkUserExistence(userId)
    const notifications = await prisma.notificationMember.findMany({
        where: {
            id_member: userId
        },
        include: {
            notification: true
        }
    })

    if (notifications.length === 0) {
        const error = new Error(`You dont have any notifications`);
        error.statusCode = 404;
        throw error
    }

    return notifications
}


export const deleteUserNotification = async (userId, notificationId) => {
    await checkUserExistence(userId);
    const notification = await checkNotificationExistence(notificationId)

    if (!notification) {
        const error = new Error(`Notification doesn't exist`);
        error.statusCode = 404;
        throw error
    }


    const notificationMember = await prisma.notificationMember.findUnique({
        where: {
            id_member_id_notification: {
                id_member: userId,
                id_notification: notification.id
            }
        }
    })

    if (!notificationMember) {
        const error = new Error(`Cant delete other member notification`);
        error.statusCode = 401;
        throw error
    }

    const deletedNotification = await prisma.notificationMember.delete({
        where: {
            id_member_id_notification: {
                id_notification: notification.id,
                id_member: userId
            }
        }
    })

    return deletedNotification
}

export const markUserRead = async (userId, notificationId) => {

    await checkUserExistence(userId);
    const notification = await checkNotificationExistence(notificationId)

    if (!notification) {
        const error = new Error(`Notification doesn't exist`);
        error.statusCode = 404;
        throw error
    }


    const notificationMember = await prisma.notificationMember.findUnique({
        where: {
            id_member_id_notification: {
                id_member: userId,
                id_notification: notification.id
            }
        }
    })

    if (!notificationMember) {
        const error = new Error(`Can't mark another member's notification as read`);
        error.statusCode = 401;
        throw error
    }

    const updatedNotification = await prisma.notificationMember.update({
        where: {
            id_member_id_notification: {
                id_notification: notification.id,
                id_member: userId
            }
        },
            data: {
                read: true
            }
    })

    return updatedNotification
}
