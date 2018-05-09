// --- Init ---
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.json( {extended: true, type: '*/*'} ));
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
}); 

// service functions
const service = require('./service.js');

// temp data
let wordlist = require('./wordlist.js');
let game = {};

// --- Routers ---
app.post('/game', (req, res) => {
	const id = service.generateId();
	const secret = service.pickWord();
	game[id] = {};
	game[id].secret = secret;
	game[id].guess = [];
	game[id].alphabet = service.generateAlphabet();
	game[id].wordlist = service.copyArray(wordlist);
	game[id].matched = null;

	if (id && secret) {
		res.send({
			id, 
			secret
		});
	}
	else {
		res.send(500, { error: 'No id and secret returned.' } );
	}
});

app.put('/game/:id/guessed', (req, res) => {
	const id = req.params.id;
	game[id].matched = req.body.matched;

	game[id] = service.generateGuess(game[id]);
	const guess = game[id].guess[ game[id].guess.length-1 ];

	if (guess) {
		res.send( {
			guess
		} );
	}
	else {
		res.send(500, { error: 'No guess made.' } );
	}
});

app.get('/game/:id/guess/:guess', (req, res) => {
	const result = service.checkGuess(req.params.guess, game[req.params.id].secret);

	if(result) {
		res.send( result );
	}
	else {
		res.send(500, { error: 'Guess was not checked.' } );
	}
});

app.delete('/game/:id', (req, res) => {
	const id = req.params.id;

	if (delete game[id]) {
		res.send( {id} );
	}
	else {
		res.send(500, { error: 'Cannot delete game.' } );
	}
});

// Test
app.get('/', (req, res) => {
	res.send(200);
});

// --- Start ---
app.listen(PORT, () => {
	console.log(`Srever listening at http://localhost:${PORT}`);
});