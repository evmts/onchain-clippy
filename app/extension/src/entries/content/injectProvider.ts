import {type EIP1193Provider, announceProvider} from 'mipd';
import { v4 as uuidv4 } from '@lukeed/uuid'
import { getProvider } from '../../provider.js';

export function injectProvider() {
    const provider = getProvider()

    window.ethereum = provider
    window.dispatchEvent(new Event('ethereum#initialized'))

    announceProvider({
        // icon is a place holder, rdns is also a place holder 
        info: {
            icon: 'data:image/svg+xml,<svg width="337" height="337" viewBox="0 0 337 337" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="337" height="337" fill="black"/><path d="M169 72L253.004 120.5V217.5L169 266L84.9955 217.5V120.5L169 72Z" fill="white"/><circle cx="170.054" cy="167.946" r="43.2283" fill="black"/><circle cx="170.054" cy="167.946" r="22.1413" fill="white"/></svg>',
            name: 'Onchain Clippy',
            rdns: 'sh.tevm',
            uuid: uuidv4(),
        },
        provider: provider as EIP1193Provider
    })

    // re-injects the provider on demand. Pattern from https://github.com/DarkFlorist/TheInterceptor/blob/24efc60711c9e9f90b71915461961153535c7474/app/inpage/ts/inpage.ts#L761
    const interceptorCapturedDispatcher = window.dispatchEvent
    window.dispatchEvent = (event: Event) => {
        interceptorCapturedDispatcher(event)
        if (!(typeof event === 'object' && event !== null && 'type' in event && typeof event.type === 'string')) return true
        if (event.type !== 'ethereum#initialized') return true
        window.ethereum = provider
        window.dispatchEvent = interceptorCapturedDispatcher
        return true
    } 
}



