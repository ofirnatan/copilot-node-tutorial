// A basic Node.js express server on port 3000
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Save the World!');
});

// This is a superheros API server that supports 3 GET endpoints
// 1. /superheroes/all - returns a list of all superheroes, as a JSON array
// 2. /superheroes/:id - returns a specific superhero by id, as a JSON object
// 3. /superheroes/:id/powerstats - returns a the powers statistics for uperhero by id, as a JSON object

// The data is stored in a JSON file in the project folder called superheros.json
const superheroes = require('./superheroes.json');

// get HTML file from public folder
app.get('/superheroes', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

// get all superheroes
app.get('/superheroes/all', (req, res) => {
    res.json(superheroes);
});

// get superhero by id
app.get('/superheroes/:id', (req, res) => {
    const id = req.params.id;
    const superhero = superheroes.find(s => s.id == id);
    res.json(superhero);
});

// get superhero powerstats by id
app.get('/superheroes/:id/powerstats', (req, res) => {
    const id = req.params.id;
    const superhero = superheroes.find(s => s.id == id);
    res.json(superhero.powerstats);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// To run tests (tutorial step 2) comment out above app.listen() and uncomment below
//module.exports = app;