export let sleep = (time, debug) => {
	if (!debug) {
		return new Promise( (resolve) => {
			setTimeout( resolve, time)
		});
	}
	return;
};
