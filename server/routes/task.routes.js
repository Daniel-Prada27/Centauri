import express from 'express'
import * as controller from '#server/controllers/task.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const taskRouter = express.Router();

taskRouter.post('',
    ValidateSession.validateSession,
    SchemaValidation.validateTaskCreation,
    controller.createTask);

taskRouter.get('/:teamId',
    ValidateSession.validateSession,
    controller.readTasks
);
