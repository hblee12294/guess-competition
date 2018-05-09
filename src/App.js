import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Control from './Control';
import Panel from './Panel';

// Others
import { callGetRequest, callPostRequest, callPutRequest, callDeleteRequest } from './script/request.js';
import { sleep } from './script/function.js';
import config from './config.json';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			started: false,
			players: [{
					name: 'Alfred',
					id: null,
					secret: null,
					guess: null,
					records: []
				}, {
					name: 'Barbara',
					id: null,
					secret: null,
					guess: null,
					records: []
				}],
			winner: null,
			turns: 0,
			debug: false
		};

		this.switchStart = this.switchStart.bind(this);
		this.startGame = this.startGame.bind(this);
		this.updateInput = this.updateInput.bind(this);
		this.nextTurn = this.nextTurn.bind(this);
		this.checkGuess = this.checkGuess.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.switchMode = this.switchMode.bind(this);
	}

	switchStart() {
		this.setState({
			started: !this.state.started
		});
	}

	async startGame() {
		this.switchStart();
		try {
			let players = this.state.players;

			for (let player of players) {
				let server = await callPostRequest(config[player.name.toLowerCase()] + '/game', {});
				player.id = server.id;
				player.secret = server.secret;
				await this.updateInput(players);
			}
			await sleep(500, this.state.debug);

			let guess = null;
			while(!this.state.winner) {
				if (this.state.turns === 0) {
					guess = await callPutRequest(config.alfred + '/game/' + players[0].id + '/guessed', {});
					players[0].guess = guess.guess;
					await this.updateInput(players)
					players[0].records.push( await callGetRequest(config.barbara + '/game/' + players[1].id + '/guess/' + players[0].guess) );
					this.setState( {players} );
					if (this.checkGuess(players[0].records[this.state.turns], 0)) {
						this.setState({
							players,
							turns: this.state.turns + 1 
						});
						continue;
					}

					await sleep(500, this.state.debug);

					guess = await callPutRequest(config.barbara + '/game/' + players[1].id + '/guessed', {});
					players[1].guess = guess.guess;
					await this.updateInput(players)
					players[1].records.push( await callGetRequest(config.alfred + '/game/' + players[0].id + '/guess/' + players[1].guess) );
					this.setState( {players} );
					if (this.checkGuess(players[1].records[this.state.turns], 1)) {
						this.setState({
							players,
							turns: this.state.turns + 1 
						});
						continue;
					}

					this.nextTurn(players);
				}
				
				guess = await callPutRequest(config.alfred + '/game/' + players[0].id + '/guessed', {matched: players[0].records[this.state.turns-1].matched} );
				players[0].guess = guess.guess;
				await this.updateInput(players)
				players[0].records.push( await callGetRequest(config.barbara + '/game/' + players[1].id + '/guess/' + players[0].guess) );
				this.setState( {players} );
				if (this.checkGuess(players[0].records[this.state.turns], 0)) {
					this.setState({
						players,
						turns: this.state.turns + 1 
					});
					continue;
				}

				await sleep(500, this.state.debug);

				guess = await callPutRequest(config.barbara + '/game/' + players[1].id + '/guessed', {matched: players[1].records[this.state.turns-1].matched} );
				players[1].guess = guess.guess;
				await this.updateInput(players)
				players[1].records.push( await callGetRequest(config.alfred + '/game/' + players[0].id + '/guess/' + players[1].guess) );
				this.setState( {players} );
				if (this.checkGuess(players[1].records[this.state.turns], 1)) {
					this.setState({
						players,
						turns: this.state.turns + 1 
					});
					continue;
				}

				this.nextTurn(players);
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	async updateInput(players) {
		this.setState( {players} );
		await sleep(1000, this.state.debug);
	}

	nextTurn(players) {
		players[0].guess = null;
		players[1].guess = null;
		this.setState({
			players,
			turns: this.state.turns + 1 
		});
	}

	checkGuess(result, playerIndex) {
		if (result.hasWon) {
			this.setState({
				winner: this.state.players[playerIndex].name
			});
			return true;
		}
		return false;
	}

	resetGame() {
		for (let player of this.state.players) {
			callDeleteRequest(config[player.name.toLowerCase()] + '/game/' + player.id);
		}

		this.setState({
			started: false,
			players: [{
					name: 'Alfred',
					id: null,
					secret: null,
					guess: null,
					records: []
				}, {
					name: 'Barbara',
					id: null,
					secret: null,
					guess: null,
					records: []
				}],
			winner: null,
			turns: 0,
			debug: false
		});
	}

	switchMode() {
		this.setState({
			debug: !this.state.debug
		});
	}

  	render() {
  		let panels = null;
		if (this.state.started) {
			panels = (
				<main>
		      		<Panel player={this.state.players[0]} />
			      	<Panel player={this.state.players[1]} />
			    </main>
			);
		}

		let quick = (
			<div className={ `quick ${ this.state.debug ? 'debug' : '' }` }>
				<label htmlFor="checkbox">{ this.state.debug ? 'Normal Mode' : 'Quick Mode' }</label>
				<input type="checkbox" id="checkbox" checked={this.state.debug} onChange={this.switchMode} />
			</div>
		);

	    return (
		    <div className="App">
		    	{ quick }
		      	<Header started={this.state.started}
		      	        winner={this.state.winner}
		      	        turns={this.state.turns} />
		      	<Control started={this.state.started}
		      	         winner={this.state.winner}
		      	         start={this.startGame}
		      	         reset={this.resetGame} />
				{ panels }
		    </div>
	    );
	}
}

export default App;
