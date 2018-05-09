import React from 'react';
import './Control.css';

const Control = ( {started, winner, start, reset} ) => {
	return (
		<div className={ `control ${ !started || winner ? '' : 'control-hidden' }` }>
			<button onClick={winner === null ? start : reset}>{ winner === null ? 'Start': 'New Game' }</button>
		</div>
	);
};

export default Control;