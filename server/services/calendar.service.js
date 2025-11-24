import dotenv from 'dotenv'
import { google } from 'googleapis'
import { auth } from "#server/lib/auth.js"

dotenv.config({ path: '../.env' })

export const getCalendarList = async (req, res, next) => {

    const session = req.session.session
    console.log("AA");
    console.log(session);

    // Check if the session contains the necessary tokens
    if (!session || !session.accessToken) {
        const error = new Error(`No valid session or accesToken found`);
        error.statusCode = 401
        throw error
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    // Set the OAuth2 client's credentials with the user's access token
    oauth2Client.setCredentials({
        access_token: session.accessToken
    });

    // Initialize the Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        // Fetch the list of calendars
        const calendarList = await calendar.calendarList.list();
        console.log(calendarList.data.items);
        // Send the calendar list in the response
        // res.status(200).json(calendarList.data.items);
        return calendarList.data.items
    } catch (error) {
        console.error('Error fetching calendar list:', error);
        // res.status(500).send('Error fetching calendar list');
        error.statusCode = 401;
        throw error
    }
};

export const getCalendarEvents = async (req, res, next) => {

    const session = req.session.session;
    const user = req.session.user
    const userEmail = user.email

    if (!session || !session.accessToken) {
        const error = new Error("No valid session or accessToken found");
        error.statusCode = 401;
        throw error;
    }

    // Init OAuth2
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: session.accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const result = await calendar.events.list({
            calendarId: "primary",     // or a calendar ID returned earlier
            singleEvents: true,
            maxResults: 20,
            orderBy: "startTime",
            timeMin: new Date().toISOString(),  // upcoming events
        });

        const events = result.data.items || [];
        console.log("Events:", events);
        return events

    } catch (error) {
        console.error("Error fetching events:", error.message);
        error.statusCode = 500;
        throw error;
    }
};

export const createCalendarEvent = async (req, res, next) => {
    const { name, startDate, endDate } = req.body;  // Expecting `name`, `startDate`, and `endDate` from the request body
    const session = req.session.session;

    if (!session || !session.accessToken) {
        const error = new Error("No valid session or accessToken found");
        error.statusCode = 401;
        throw error;
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: session.accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Prepare event data with name, start, and end date
    const event = {
        summary: name,  // Event name
        start: {
            dateTime: new Date(startDate).toISOString(),  // ISO format for start date
            timeZone: 'UTC',  // Adjust timezone if needed
        },
        end: {
            dateTime: new Date(endDate).toISOString(),  // ISO format for end date
            timeZone: 'UTC',  // Adjust timezone if needed
        },
    };

    try {
        // Insert the event into the user's calendar
        const createdEvent = await calendar.events.insert({
            calendarId: 'primary', // 'primary' refers to the user's main calendar
            resource: event,
        });

        console.log("Event created:", createdEvent.data);
        // res.status(200).json(createdEvent.data); // Respond with the created event's data
        return createdEvent.data
    } catch (error) {
        console.error("Error creating event:", error.message);
        error.statusCode = 500;
        throw error;
    }
};