import * as memberService from '#server/services/member.service.js'
import { MemberSchema } from '#server/models/schema.member.js'
import { authClient } from '#server/lib/auth-client.js'


export const readAllMembers = async (req, res) => {
    try {
        const teamId = req.params.teamId
        const result = await memberService.readAllMembers(teamId)
        res.status(200).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Something went wrong!' });
    }
}