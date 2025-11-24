import * as calendarService from '#server/services/calendar.service.js'
import { TaskSchema, TaskCreationSchema } from '#server/models/schema.task.js'
import { authClient } from '#server/lib/auth-client.js'


export const getCalendarList = async (req, res) => {
    try {
        const session = req.session.session
        const result = await calendarService.getCalendarList(session)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const getCalendarEvents = async (req, res) => {
    try {
        const session = req.session.session
        const user = req.session
        const result = await calendarService.getCalendarEvents(session)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const createCalendarEvent = async (req, res) => {
    try {

        const session = req.session.session
        const event = req.body

        const result = await calendarService.createCalendarEvent(session, event)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const deleteCalendarEvent = async (req, res) => {
    try {

        const session = req.session.session
        const { eventId } = req.params;

        const result = await calendarService.deleteCalendarEvent(session, eventId)
        res.status(201).json(result)
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}