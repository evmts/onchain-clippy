import { type EIP1193Provider } from 'viem'

const events = ['accountsChanged', 'message', 'connect', 'disconnect', 'chainChanged'] as const

type EventType = (typeof events)[number]

type Callback = (data: any) => void

const eventListeners: Map<EventType, Set<Callback>> = new Map(events.map((event) => [event, new Set<Callback>()]))

// would probably need to handle by sending this to the background worker
function getCallback(event: EventType, _data: any) {
	switch (event) {
		case 'accountsChanged':
			break
		case 'connect':
			break
		case 'disconnect':
			break
		case 'chainChanged':
			break
		default:
			console.warn(`Unhandled event: ${event}`)
	}
}

export function isValidMessageEvent(event: unknown): event is { data: any } {
	return (
		typeof event === 'object' &&
		event !== null &&
		'data' in event &&
		typeof event.data === 'object' &&
		event.data !== null
	)
}

export const callbackRegister = <T extends EventType>(event: T, callback: (data: any) => void) => {
	const listeners = eventListeners.get(event)
	if (!listeners) {
		console.warn(`No listeners initialized for event: ${event}`)
		return
	}
	listeners.add(callback)
}

export const callbackUnregister = <T extends EventType>(event: T, callback: (data: any) => void) => {
	const listeners = eventListeners.get(event)
	if (listeners) {
		listeners.delete(callback)
	}
}

export function subscribeProviderEvents(provider: EIP1193Provider): EIP1193Provider {
	events
		.filter((event) => event !== 'message')
		.forEach((event) => {
			provider.on(event, (data: any) => getCallback(event, data))
		})
	return provider
}
