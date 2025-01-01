const events = ['accountsChanged', 'message', 'connect', 'disconnect', 'chainChanged'] as const;

type EventType = typeof events[number];
type Callback = (data: any) => void;

const eventListeners: Map<EventType, Set<Callback>> = new Map(
    events.map(event => [event, new Set<Callback>()])
);

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

function handleUndefinedInterceptor() {
    events.filter(event => event !== 'message').forEach(event => {
        window.ethereum?.on(event, () => {});
    });
}

export const callbackRegister = <T extends EventType>(event: T, callback: (data: any) => void) => {
    const listeners = eventListeners.get(event);
    if (!listeners) {
        console.warn(`No listeners initialized for event: ${event}`);
        return;
    }
    listeners.add(callback);
};
   
export const callbackUnregister = <T extends EventType>(event: T, callback: (data: any) => void) => {
    const listeners = eventListeners.get(event);
    if (listeners) {
        listeners.delete(callback);
    }
};

// re-inject the provider
export function startMessageListener() {
    const eventCallBack = async (event: unknown) => {
        if (!window.ethereum?.isInterceptor
            || window.ethereum?.isInterceptor === undefined) {
                handleUndefinedInterceptor()
        }
        // console.log(event);
        // console.log(12);
        console.log("my own interceptor: ", window.ethereum?.isInterceptor)
        console.log("isValidMessageEvent", isValidMessageEvent(event))
    }
    window.addEventListener('message', eventCallBack);
}