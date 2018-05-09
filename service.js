// --- Data ---
const wordlist = require('./wordlist.js');
let idlist = (() => {
	let list = [];
	for (let i = 0; i < 1000; ++i) {
		if (i < 10) {
			i = '00' + i;
		}
		else if (i < 100) {
			i = '0' + i;
		}
		else {
			i += '';
		}
		list.push(i);
	}
	return list;
})();


// --- Auxiliary functions for guessCheck() ---
const compareMatchings = (guess, word) => {
		let arrChars = guess.split('');
		let i = 0;

		for (let char of word) {
			i = arrChars.indexOf(char);
			if (i >= 0) {
				arrChars.splice(i, 1);
			}
		}

		return guess.length - arrChars.length;
};

const compareLetters = (guess, word) => {
	let result = {};

	if (guess === word) {
		result.hasWon = true;
		result.matched = guess.length;
	}
	else {
		result.hasWon = false;
		result.matched = compareMatchings(guess, word);
	}
	result.guess = guess;

	return result;
};


// --- Auxiliary functions for generateGuess ---
const generateAlphabet = () => {
	let alphabet = {};
	let string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let l of string.split('')) {
		alphabet[l] = 0;
	}
	return alphabet;
}

const updateAlphabet = (game, matched) => {
	let guess = game.guess[ game.guess.length-1 ];

	switch (matched) {
		case 0:
			for (let l of guess.split('')) {
				delete game.alphabet[l];
			}
			break;
		case 1:
			for (let l of guess.split('')) {
				game.alphabet[l] += 1;
			}
			break;
		case 2:
			for (let l of guess.split('')) {
				game.alphabet[l] += 2;
			}
			break;
		case 3:
			for (let l of guess.split('')) {
				game.alphabet[l] += 3;
			}
			break;
		case 4:
			for (let l of guess.split('')) {
				game.alphabet[l] += 4;
			}
			break;
	}

	return game;
};

const generateGuessAdvc = (game) => {

	for (let i in game.wordlist) {
		if ( checkValid(game.alphabet, game.wordlist[i]) ) {
			game.guess.push(game.wordlist[i]);
			game.wordlist.splice(i, 1);
			break;
		}
	}

	return game;
};

const checkValid = (alphabet, word) => {
	for (let l of word) {
		if ( !alphabet.hasOwnProperty(l) ) {
			return false;
		}
	}

	return true; 
};

// -----

const generateGuess = (game) => {
	const preGuess = game.guess[ game.guess.length-1 ];
	const matched = game.matched;

	if (matched >= 0) {
		game.wordlist = conciseWordlist(game.wordlist, preGuess, matched);

	}


	for (let i in game.wordlist) {
		if ( checkValid(game.alphabet, game.wordlist[i]) ) {
			game.guess.push(game.wordlist[i]);
			game.wordlist.splice(i, 1);
			break;
		}
		else {
			game.wordlist.splice(i, 1);
		}
	}

	return game;
}

const conciseWordlist = (wordlist, preGuess, matched) => {
	for (let i in wordlist) {
		if ( compareMatchings(wordlist[i], preGuess) > matched ) {
			// console.log(wordlist[i] + ' - delete');
			wordlist.splice(i, 1);
		}
	}

	return wordlist;
}


// --- Service interfaces ---
const service = {
	pickWord: () => {
		return wordlist[ Math.floor(Math.random() * wordlist.length) ];
	},
	generateId: () => {
		return idlist.splice( Math.floor(Math.random() * idlist.length), 1 )[0];
	},
	generateAlphabet: () => {
		return generateAlphabet(); 
	},
	updateAlphabet: (game, matched) => {
		return updateAlphabet(game, matched);
	},
	generateGuess: (game) => {
		return generateGuess(game);
	},
	generateGuessAdvc: (game) => {
		return generateGuessAdvc(game);
	},
	checkGuess: (guess, word) => {
		const result = compareLetters(guess, word);
		return result;
	},
	copyArray: (arr) => {
		let newArr = [];
		for (let i in arr) {
			newArr[i] = arr[i];
		}
		return newArr;
	}
};

module.exports = service;