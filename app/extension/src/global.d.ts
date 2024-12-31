interface Window {
	// dispatchEvent: (event: Event) => boolean
	ethereum?: WindowEthereum // see how to change to eip1193
	// web3?: {
	// 	currentProvider: WindowEthereum
	// 	accounts: readonly string[]
	// }
}

type WindowEthereum = InjectedState & {
	on: <T extends EventType>(event: T, callback: (data: any) => void) => void;
	removeListener: <T extends EventType>(event: T, callback: (data: any) => void) => void;
	request: ({ method, params }: { method: string; params: unknown[] | any }) => Promise<any>;
}

type InjectedState = {
	isInterceptor: boolean;
}
