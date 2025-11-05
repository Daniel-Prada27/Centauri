import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "#server/lib/auth.js";

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true
};

const app = express();
app.use(cors(corsOptions));
const PORT = 5000

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json())

app.get('/api', (req, res) => {
    res.json({"users": ["Jaime", "Sara", "Prada"]})
})

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`);
})