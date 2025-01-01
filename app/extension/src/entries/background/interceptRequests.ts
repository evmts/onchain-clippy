interface TransactionData {
  chainId: string; 
  data: string;
  from: string; 
  gas: string;
  gasPrice: string;
  to: string; 
  value: string;
}

function startMessageListener() {
  function intercept(message: TransactionData) {
    console.log("Hello, World")
    console.log(message)
    console.log(message.chainId)
    console.log(message.data)
    console.log(message.from)
    console.log(message.gas)
    console.log(message.gasPrice)
    console.log(message.to)
    console.log(message.value)
  }
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.message?.method != "eth_sendTransaction") return 
    intercept(message.message.params[0])
  })
}

startMessageListener()

