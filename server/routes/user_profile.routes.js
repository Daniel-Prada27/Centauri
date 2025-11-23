import express from 'express'
import * as controller from '#server/controllers/user_profile.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'
import * as ValidateSession from '#server/middleware/validateSession.js'

export const userProfileRouter = express.Router();

userProfileRouter.post('',
    ValidateSession.validateSession,
    SchemaValidation.validateUserProfile,
    controller.addUserProfile);

userProfileRouter.get('/complete',
    ValidateSession.validateSession,
    controller.readWholeUser);

userProfileRouter.get('/email',
    ValidateSession.validateSession,
    controller.readUserByEmail);

userProfileRouter.get('/:id',
    ValidateSession.validateSession,
    controller.readUserProfileById);

userProfileRouter.get('',
    ValidateSession.validateSession,
    controller.readUserProfile);



userProfileRouter.put('',
    ValidateSession.validateSession,
    SchemaValidation.validateUserProfile,
    controller.updateUserProfile);

userProfileRouter.delete('/delete-profile',
    ValidateSession.validateSession,
    controller.deleteUserProfile);