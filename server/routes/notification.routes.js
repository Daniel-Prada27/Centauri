import express from 'express'
import * as controller from '#server/controllers/notification.controller.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const notificationRouter = express.Router();


notificationRouter.get('',
    ValidateSession.validateSession,
    controller.readAllNotifications
);

notificationRouter.put('/:notificationId',
    ValidateSession.validateSession,
    controller.updateUserNotification
);

notificationRouter.delete("/:notificationId",
    ValidateSession.validateSession,
    controller.deleteNotification
)
