chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.event != "input"){
            return   
        }
        
        alert("INPUT EVENT")
    }
)