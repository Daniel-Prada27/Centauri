import * as teamService from '#server/services/team.service.js'
import { TeamSchema } from '#server/models/schema.team.js'
import { authClient } from '#server/lib/auth-client.js'


export const createTeam = async (req, res) => {
    try {

        const team = TeamSchema.parse(req.body)
        const userId = req.session.user.id

        const result = await teamService.createTeam(userId, team)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const readTeam = async (req, res) => {
    try {
        const userId = req.session.user.id
        const result = await teamService.readTeam(userId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const updateTeam = async (req, res) => {
    try {
        const team = TeamSchema.parse(req.body)
        const teamId = req.params.teamId

        const result = await teamService.updateTeam(teamId, team)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}