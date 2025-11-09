import * as taskService from '#server/services/task.service.js'
import { TaskSchema, TaskCreationSchema } from '#server/models/schema.task.js'
import { authClient } from '#server/lib/auth-client.js'


export const createTask = async (req, res) => {
    try {

        const task = TaskCreationSchema.parse(req.body)
        const userId = req.session.user.id

        const result = await taskService.createTask(userId, task)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}