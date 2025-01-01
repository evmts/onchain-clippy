


function try_fn() {

  window.dispatchEvent(new Event('ethereum#initialized'))
  const interceptorCapturedDispatcher = window.dispatchEvent
    window.dispatchEvent = (event: Event) => { 
      
      console.log("Hello World")
      console.log(event)
      interceptorCapturedDispatcher(event)
      window.dispatchEvent = interceptorCapturedDispatcher
      return true
    }

}

try_fn();     