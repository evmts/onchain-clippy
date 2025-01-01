interface Window {
	ethereum: WindowEthereum 
}

type WindowEthereum = InjectedState & {
	on: <T extends EventType>(event: T, callback: (data: any) => void) => void;
	removeListener: <T extends EventType>(event: T, callback: (data: any) => void) => void;
	request: ({ method, params }: { method: string; params: unknown[] | any }) => Promise<any>;
}

