import React from 'react';
import './Panel.css';

// Components
import History from './History';

const Panel = ( {player} ) => {
	let inputSecret = null;
	if (player.secret) {
		inputSecret = <div className="input">{player.secret}</div>;
	}

	let inputGuess = null;
	if (player.guess) {
		inputGuess = <div className="input">{player.guess}</div>;
	}

	return (
		<div className="panel">
			<div className="name">{player.name}</div>
			<div className="field">
				<div className="tag">Secret</div>
				{ inputSecret }
			</div>
			<div className="field">
				<div className="tag">Guess</div>
				{ inputGuess }
			</div>
			<History records={player.records} />
		</div>
	);
}

export default Panel;