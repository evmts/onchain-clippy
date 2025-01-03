window.addEventListener('message', (event) => {
	if (
		typeof event !== 'object' ||
		event === null ||
		!('data' in event) ||
		typeof event.data !== 'object' ||
		event.data === null ||
		!('payload' in event.data) ||
		typeof event.data.payload !== 'object' ||
		event.data.payload === null ||
		!('method' in event.data.payload)
	) {
		return
	}
	chrome.runtime.sendMessage({ message: event.data.payload })
})
