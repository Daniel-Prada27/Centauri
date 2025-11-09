import express from 'express'
import * as controller from '#server/controllers/team.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const teamRouter = express.Router();

teamRouter.post('',
    ValidateSession.validateSession,
    SchemaValidation.validateTeam,
    controller.createTeam);

teamRouter.get('/get-teams',
    ValidateSession.validateSession,
    controller.readTeam);

teamRouter.put('/:teamId',
    ValidateSession.validateSession,
    controller.updateTeam);