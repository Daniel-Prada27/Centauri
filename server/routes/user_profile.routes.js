import express from 'express'
import * as controller from '#server/controllers/user_profile.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'

export const userProfileRouter = express.Router();

userProfileRouter.post('/complete-profile', controller.addUserProfile);
userProfileRouter.put('/update-profile', SchemaValidation.validateUserProfile, controller.updateUserProfile);
