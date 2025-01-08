import { type EIP1193Provider } from 'viem'
import { callbackRegister, callbackUnregister, subscribeProviderEvents } from './event.js'

export function getProvider(): EIP1193Provider {
	const provider: EIP1193Provider = {
		on: callbackRegister,
		removeListener: callbackUnregister,
		async request({ method, params }) {
			switch (method) {
				default:
					throw new Error(`Method not supported, with params ${params}`)
			}
		},
	}
	subscribeProviderEvents(provider)
	return provider
}
