import { simulatedFetch } from './simulatedService.js';

// Detect if we should use simulation mode
// 1. Build-time: REACT_APP_SIMULATION_MODE environment variable
// 2. Runtime: Check if running on GitHub Pages (github.io domain)
const isSimulationMode = () => {
	// Check build-time environment variable
	if (process.env.REACT_APP_SIMULATION_MODE === 'true') {
		return true;
	}
	// Runtime detection for GitHub Pages
	if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
		return true;
	}
	return false;
};

// Wrapper function that routes to real fetch or simulated fetch
const smartFetch = async (url, options) => {
	if (isSimulationMode()) {
		return simulatedFetch(url, options);
	}
	const res = await fetch(url, options);
	if (res.ok) {
		return res.json();
	}
	throw new Error(await res.text());
};

export const callGetRequest = (url) => {
	return smartFetch(url, {
		method: 'GET',
		mode: 'cors'
	})
	.catch( error => Promise.reject('Get failed: ' + error) );
}

export const callPostRequest = (url, data) => {
	return smartFetch(url, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(data)
	})
	.catch( error => Promise.reject('Post failed: ' + error) );
}

export const callPutRequest = (url, data) => {
	return smartFetch(url, {
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify(data)
	})
	.catch( error => Promise.reject('Put failed: ' + error) );
}

export const callDeleteRequest = (url) => {
	return smartFetch(url, {
		method: 'DELETE',
		mode: 'cors'
	})
	.catch( error => Promise.reject('Delete failed: ' + error) );
}