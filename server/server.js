import express from 'express';
import cors from 'cors';

const corsOptions = {
    origin: ["http://localhost:5173"]
};

const app = express();
app.use(cors(corsOptions));
const PORT = 5000

app.get('/api', (req, res) => {
    res.json({"users": ["Jaime", "Sara", "Prada"]})
})

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`);
})