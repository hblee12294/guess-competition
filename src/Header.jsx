import React from 'react';
import './Header.css';

const Header = ( {started, winner, turns} ) => {
	const message = (
		winner === null ? `${turns} of turns taken` : `${winner} wins in ${turns} turns!`
	);

	return (
		<header>
			<div className="title">Guess Game</div>
			<div className={ `billboard ${ started ? '' : 'billboard-hidden' }` }>{ message }</div>
		</header>
	);
};

export default Header;