function startMessageListener() {
  function intercept(_message: any) {
    console.log("Hello, World")
  }
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.message?.method != "eth_sendTransaction") return 
    intercept(message.message)
  })
}

startMessageListener()

