import express from 'express'
import * as controller from '#server/controllers/user_profile.controller.js'
import * as SchemaValidation from '#server/middleware/validateSchema.js'

export const userProfileRouter = express.Router();

userProfileRouter.post('/complete-profile', SchemaValidation.validateUserProfile, controller.addUserProfile);
// Maybe change to /profile/:id ??
userProfileRouter.get('/get-profile', controller.readUserProfile);
userProfileRouter.put('/update-profile', SchemaValidation.validateUserProfile, controller.updateUserProfile);
userProfileRouter.delete('/delete-profile', controller.deleteUserProfile);