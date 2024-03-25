const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = 8000;
const pkTimeOptions = {
    timeZone: 'Asia/Karachi',
    
  };

let mockDB = [
    { id: 1, name: 'Jawad' },
    { id: 2, name: 'Zain' },
    { id: 3, name: 'ALi' }
];


app.use(bodyParser.json());
const logData = fs.createWriteStream('request_logs.txt', { flags: 'a' });


app.use((req, res, next) => {
 if(req.method === 'POST' || req.method === "DELETE" || req.method === 'PUT' ){
    const logEntry = `[${new Date().toLocaleString('en-PK', pkTimeOptions)}] ${req.method} ${req.url} ${JSON.stringify(req.body)} \n`;
    logData.write(logEntry);
 }else{
    const logEntry = `[${new Date().toLocaleString('en-PK', pkTimeOptions)}] ${req.method} ${req.url}\n`;
  
    logData.write(logEntry);
 }
  next();
});


app.get('/items', (req, res) => {
    res.json(mockDB);
    authenticationToken();
});

app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = mockDB.find(item => item.id === id);
    if (!item) {
        res.status(404).json({ message: 'Item not found' });
    } else {
        res.json(item);
    }
});


app.post('/items', (req, res) => {
    const newItem = req.body;
    mockDB.push(newItem);
    res.status(201).json(newItem);
});


app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = mockDB.findIndex(item => item.id === id);
    if (index === -1) {
        res.status(404).json({ message: 'Item not found' });
    } else {
        mockDB[index] = req.body;
        res.json(mockDB[index]);
    }
});


app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = mockDB.findIndex(item => item.id === id);
    if (index === -1) {
        res.status(404).json({ message: 'Item not found' });
    } else {
        const deletedItem = mockDB.splice(index, 1);
        res.json(deletedItem[0]);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
