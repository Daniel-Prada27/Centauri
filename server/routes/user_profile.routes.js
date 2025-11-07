import express from 'express'
import * as controller from '#server/controllers/user_profile.controller.js'

export const userProfileRouter = express.Router();

userProfileRouter.post('/complete-profile', controller.addUserProfile);
