import express from 'express'
import * as controller from '#server/controllers/calendar.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const calendarRouter = express.Router();

// calendarRouter.post('',
//     ValidateSession.validateSession,
//     SchemaValidation.validateTaskCreation,
//     controller.createTask);

calendarRouter.get('',
    ValidateSession.validateSession,
    controller.getCalendarList
);

calendarRouter.get('/events',
    ValidateSession.validateSession,
    controller.getCalendarEvents
);

calendarRouter.post('/events',
    ValidateSession.validateSession,
    controller.createCalendarEvent
);

// calendarRouter.put('/:taskId',
//     ValidateSession.validateSession,
//     SchemaValidation.validateTask,
//     controller.updateTask
// );

// calendarRouter.delete('/:taskId',
//     ValidateSession.validateSession,
//     controller.deleteTask
// );