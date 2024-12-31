import {type EIP1193Provider, announceProvider} from 'mipd';
import { v4 as uuidv4 } from '@lukeed/uuid'
import { callbackRegister, callbackUnregister } from './event.js';

export function injectProvider() {
    const request = async ({ method , params }: {method: string, params: unknown[] | any}) => {

        console.log(params)
        switch (method) {
          case 'eth_requestAccounts': {
            // Returns an array of addresses
            console.log(1)
            return ['0x729898f36f263F048A8Fa26f342AbAc950607808'] as any;   // Return type is Address[]
          }
          case 'eth_chainId': {
            // Returns a string (Quantity type)
            console.log(2)
            return '1' as string;  // Return type is string
          }
  
          default:
            throw new Error('Method not supported');
        }
    }

    // eth_requestAccount, eth_chainId, and i guess others background

    let provider = {
        isInterceptor: true,
        on: callbackRegister,
        removeListener: callbackUnregister,
        request
    }

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
}






/**
 * export function startMessageListener() {
    const eventCallback = async (event: unknown) => {
        try {
            if (!isValidMessageEvent(event)) return;

            // Extract the forwarded request
            const forwardRequest = event.data;

            if (forwardRequest.type === 'result') {
                handleResult(forwardRequest);
                return;
            }

            if (forwardRequest.type === 'forwardToSigner') {
                await forwardToSigner(forwardRequest);
                return;
            }

            throw new Error('Unhandled message type');
        } catch (error) {
            handleError(event, error);
        }
    };

    window.addEventListener('message', eventCallback);
}

function isValidMessageEvent(event: unknown): event is { data: any } {
    return (
        typeof event === 'object' &&
        event !== null &&
        'data' in event &&
        typeof event.data === 'object' &&
        event.data !== null &&
        'interceptorApproved' in event.data
    );
}

async function handleResult(forwardRequest: any) {
    const { requestId, error, result, method } = forwardRequest;

    if (!requestId) throw new Error('Missing requestId in result');

    const pending = outstandingRequests.get(requestId);
    if (!pending) throw new Error('Request not found');

    if (error) {
        return pending.reject(new EthereumJsonRpcError(error.code, error.message, error.data));
    }

    if (result) {
        if (metamaskCompatibilityMode && signerWindowEthereumRequest === undefined && window.ethereum) {
            handleMetamaskCompatibility(method, result);
        }
        await handleReplyRequest(forwardRequest);
        return;
    }
}

function handleMetamaskCompatibility(method: string, result: any) {
    switch (method) {
        case 'eth_accounts': {
            if (!Array.isArray(result)) throw new Error('Invalid result type for eth_accounts');
            const [address] = result;
            window.ethereum.selectedAddress = address;
            window.web3 && (window.web3.accounts = result);
            currentAddress = address;
            break;
        }
        case 'eth_chainId': {
            if (typeof result !== 'string') throw new Error('Invalid result type for eth_chainId');
            window.ethereum.chainId = result;
            window.ethereum.networkVersion = parseInt(result, 16).toString(10);
            activeChainId = result;
            break;
        }
        default:
            break;
    }
}

async function forwardToSigner(forwardRequest: any) {
    const { requestId, method, params } = forwardRequest;

    if (!requestId) throw new Error('Missing requestId for forwardToSigner');

    const pendingRequest = outstandingRequests.get(requestId);
    if (!pendingRequest) throw new Error('Pending request not found');

    if (!signerWindowEthereumRequest) {
        throw new Error('Interceptor is in wallet mode and cannot forward to an external wallet');
    }

    try {
        const reply = await signerWindowEthereumRequest({ method, params: params || [] });
        await handleReplyRequest({
            requestId,
            interceptorApproved: true,
            method,
            type: 'result',
            result: reply,
        });
    } catch (error) {
        pendingRequest.reject(parseRpcError(error));
    }
}

function handleError(event: unknown, error: unknown) {
    console.error('Message event error:', event);
    console.error('Error:', error);

    if (isValidMessageEvent(event)) {
        const { requestId } = event.data;
        if (requestId) {
            const pendingRequest = outstandingRequests.get(requestId);
            if (pendingRequest) {
                pendingRequest.reject(error instanceof Error ? error : parseRpcError(error));
            }
        }
    }

    sendMessageToBackgroundPage({ method: 'InterceptorError', params: [error] });
}

// Mocked functions (placeholders for real implementations)
const outstandingRequests = new Map();
const metamaskCompatibilityMode = true;
const signerWindowEthereumRequest = undefined;
let currentAddress = '';
let activeChainId = '';

function handleReplyRequest(request: any) {
    // Placeholder for reply handling logic
}

function parseRpcError(error: unknown) {
    return error;
}

function sendMessageToBackgroundPage(message: any) {
    console.log('Sending message to background:', message);
}

*/
