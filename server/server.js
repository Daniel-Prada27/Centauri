import express from 'express';

const app = express();

app.get('/api', (req, res) => {
    res.json({"users": ["Jaime", "Sara", "Prada"]})
})

app.listen(5000, (err)=> {
    console.log("Server started on port 5000");
})