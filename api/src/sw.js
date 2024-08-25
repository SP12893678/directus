self.addEventListener('fetch', function(event) {
	// console.log('intercept request url:', event.request.url);

	const clientId = event.clientId;

    clients.get(clientId).then((client) => {
        if (client && client.frameType === 'nested') {
            console.log('intercept request url:', event.request.url);
            console.log('client.frameType', client.frameType);
            console.log('client.url', client.url);
        }
    })
});
