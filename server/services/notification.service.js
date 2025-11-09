import { PrismaClient } from '#server/generated/prisma/client.ts'
import { readAllMembers } from '#server/services/member.service.js'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const prisma = new PrismaClient()

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
