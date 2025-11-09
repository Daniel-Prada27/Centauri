import express from 'express'
import * as controller from '#server/controllers/team.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const teamRouter = express.Router();

teamRouter.post('', // POST http://localhost:3000/team
    ValidateSession.validateSession,
    SchemaValidation.validateTeam,
    controller.createTeam);

teamRouter.get('/get-teams', // GET http://localhost:3000/team/get-teams
    ValidateSession.validateSession,
    controller.readTeam);

teamRouter.put('/:teamId', // PUT http://localhost:3000/team/41235436-f779-4e30-j803-648945736b52
    ValidateSession.validateSession,
    controller.updateTeam);

teamRouter.delete("/:teamId", // DELETE http://localhost:3000/team/47845436-p079-4e30-b603-648945736b52
    ValidateSession.validateSession,
    controller.deleteTeam
)