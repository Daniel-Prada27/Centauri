import express from 'express'
import * as controller from '#server/controllers/member.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const memberRouter = express.Router();

memberRouter.post('/invite',
    ValidateSession.validateSession,
    controller.inviteMember
);


memberRouter.get('/:teamId',
    ValidateSession.validateSession,
    controller.readAllMembers
);
