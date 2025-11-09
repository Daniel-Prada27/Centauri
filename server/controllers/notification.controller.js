import * as notificationService from '#server/services/notification.service.js'
import { authClient } from '#server/lib/auth-client.js'

export const readAllNotifications = async (req, res) => {
    try {
        const userId = req.session.user.id
        const result = await notificationService.readNotifications(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}