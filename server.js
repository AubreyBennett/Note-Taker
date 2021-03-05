// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;

// Sets up the Express App
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// GET API's
app.get('/api/notes', (req, res) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    res.json(JSON.parse(notes));
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    newNote.id = uuid();
    // read the file
    let notes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    // parse the string
    notes = JSON.parse(notes);
    // push new note
    notes.push(newNote);
    // write to the file (stringify)
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
    // send a client a successful response (res.json(notes))
    res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
    let notes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf-8');
    notes = JSON.parse(notes);
    notes = notes.filter(function(note) {
        if (req.params.id != note.id)
        return true;
        else return false;
    });
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
    res.json(notes);
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));