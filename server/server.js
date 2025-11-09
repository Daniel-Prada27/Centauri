import express from 'express';
import session from 'express-session'
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from "#server/lib/auth.js";
import {userProfileRouter} from '#server/routes/user_profile.routes.js'
import {teamRouter} from '#server/routes/team.routes.js'
import {memberRouter} from '#server/routes/member.routes.js'
import {taskRouter} from '#server/routes/task.routes.js'
import {notificationRouter} from '#server/routes/notification.routes.js'

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true
};

const app = express();
app.use(cors(corsOptions));
const PORT = 3000

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json())

app.use('/profile', userProfileRouter);
app.use('/team', teamRouter);
app.use('/member', memberRouter);
app.use('/task', taskRouter);
app.use('/notification', notificationRouter);

app.get('/api', (req, res) => {
    res.json({"users": ["Jaime", "Sara", "Prada"]})
})

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`);
})