import {resolveSimulateArgs} from './simulate.js'
import {  decodeFunctionData, http, type Abi } from 'viem';
import { createMemoryClient, type ContractParams} from "tevm";

interface TransactionData {
  chainId: string; 
  data: `0x${string}`;
  from: `0x${string}`; 
  gas: string;
  gasPrice: string;
  to: `0x${string}`; 
  value: string;
}

function startMessageListener() {
  async function intercept(message: TransactionData) {
    // console.log("Hello, World")
    // console.log(message)
    // console.log(message.chainId) // if exists do hex to number 
    // console.log(message.data)
    // console.log(message.from)
    // console.log(message.gas)
    // console.log(message.gasPrice)
    // console.log(message.to)
    // console.log(message.value)
   
    // tevm simulate transaction 
    const {abi, rpcUrl, chain} = await resolveSimulateArgs(message.to, parseInt("0x2105", 16))
    let { functionName, args } = decodeFunctionData({
      abi,
      data: message.data
    })

    const clientTevm = createMemoryClient({
        fork: {
        transport: http(rpcUrl)({}),
        },
        common: chain,
    });

    const params: ContractParams<Abi,string > = {
        abi,
        functionName,
        args,
        to: message.to,
        from: message.from,
        skipBalance: true
    }

    const result = await clientTevm.tevmContract(params)

    console.log(result)
  }
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.message?.method != "eth_sendTransaction") return 

    (async () => {
      await intercept(message.message.params[0])
    })()
    
  })
}

startMessageListener()

