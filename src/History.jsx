import React, { Component } from 'react';
import './History.css';

class History extends Component {
	componentDidUpdate() {
		this.scroll.scrollTop = this.scroll.scrollHeight;
	}	

	render() {
		const placeholder = (
			<div className="placeholder">
				Previous guessed words and number of hit letters will be recorded here.
			</div>
		);

		const recordsList = this.props.records.map( (record, index) => {
			return (
				<div className="record" key={index}>
					<span>{index+1}</span>
					<span>{record.guess}</span>
					<span>{record.matched}</span>
				</div>
			);
		});

		return (
			<div className="history">
				<div className="title">
					<span>Turn</span>
					<span>Word</span>
					<span>Hit</span>
				</div>
				<div className="records" ref={ scroll => { this.scroll =  scroll } } >
					{this.props.records.length === 0 ? placeholder : recordsList}
				</div>
			</div>
		);
	}
}

export default History;