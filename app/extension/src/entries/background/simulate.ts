import { whatsabi } from "@shazow/whatsabi";
import { createPublicClient, http, type Abi  } from 'viem';
import { formatAbi, parseAbi, } from "tevm";
import {knownChains} from '@tevm/whatsabi'

const TIMEOUT_MS = 10000;

type SimulateArgs = {
    abi: Abi;
    rpcUrl: string;
    chain: any
};


class SimulatorError extends Error {
    constructor(message: string, override readonly cause?: unknown) {
        super(message);
        this.name = 'SimulatorError';
    }
}

function validateChainId(chainId: number): void {
    if (!(chainId in knownChains)) {
        throw new SimulatorError(`Unsupported chain ID: ${chainId}`);
    }
}

async function fetchWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);

        promise
            .then((result) => {
                clearTimeout(timeout);
                resolve(result);
            })
            .catch((error) => {
                clearTimeout(timeout);
                reject(error);
            });
    });
}

export async function resolveSimulateArgs(address: string, chainId: number): Promise<SimulateArgs>{
    try {
        validateChainId(chainId);

        const client = createPublicClient({
            chain: knownChains[chainId as keyof typeof knownChains],
            transport: http()
        });

        const result = await fetchWithTimeout(
            whatsabi.autoload(address, { provider: client }),
            TIMEOUT_MS
        );

        if (!result?.abi?.length) {
            throw new SimulatorError('No ABI found for address');
        }

        const formattedAbi = formatAbi(result.abi);

        return {abi: parseAbi(formattedAbi), rpcUrl: client.chain.rpcUrls.default.http[0], chain: client.chain};
    } catch (error) {
        if (error instanceof Error && error.message.includes('timed out')) {
            throw new SimulatorError(`Operation timed out after ${TIMEOUT_MS}ms`, error);
        }
        throw new SimulatorError(error instanceof Error ? error.message : 'Unknown error occurred', error);
    }
}

