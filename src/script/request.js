export const callGetRequest = (url) => {
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	})
	.then( res => res.ok? res.json() : Promise.reject(res.text()) )
	.catch( error => Promise.reject('Get failed: ' + error) );
}

export const callPostRequest = (url, data) => {
	return fetch(url, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(data)
	})
	.then( res => res.ok? res.json() : Promise.reject(res.text()) )
	.catch( error => Promise.reject('Post failed: ' + error) );
}

export const callPutRequest = (url, data) => {
	return fetch(url, {
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify(data)
	})
	.then( res => res.ok? res.json() : Promise.reject(res.text()) )
	.catch( error => Promise.reject('Put failed: ' + error) );
}

export const callDeleteRequest = (url) => {
	return fetch(url, {
		method: 'DELETE',
		mode: 'cors'
	})
	.then( res => res.ok? res.json() : Promise.reject(res.text()) )
	.catch( error => Promise.reject('Delete failed: ' + error) );
}