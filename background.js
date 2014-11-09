
chrome.contextMenus.create({
    "title": "Make this an Achievement",
    "contexts": ["page", "selection", "image", "link"],
    "onclick": clickHandler
});

var resp = []

function clickHandler(i) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "clickCL"
        }, function (response) {
            resp.push({"pattern":response.farewell, "host":response.host});
            
            console.log(resp)
       });
    });
}


var myURL = "about:blank";
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function (tab) {
        myURL = tab.url;

        function httpGet(url) {
            var xmlHttp = null;

            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            r = xmlHttp.responseText;
            return xmlHttp.responseText;
        }
        var r = httpGet('https://ba.ngrok.com/getcount?url=' + myURL);
        chrome.browserAction.setBadgeBackgroundColor({
            color: [255, 0, 0, 255]
        });
        chrome.browserAction.setBadgeText({
            text: r + ''
        });
    });
});

function test(e){
    console.log("Notif Callback")   
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if(request.event == "notif"){
      console.log("HERE")
      console.log(request);
      chrome.notifications.create(request.id, request.cn, function(e){console.log(e)})
  
      } else if (request.event == "input"){
            sendResponse(resp.slice(-1)[0])
      }
  }
)


