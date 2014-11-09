
chrome.contextMenus.create({
    "title": "Make this an Achievements",
    "contexts": ["page", "selection", "image", "link"],
    "onclick": clickHandler
});

function clickHandler(i) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "clickCL"
        }, function (response) {
            alert(response.farewell);
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


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("HERE")
      console.log(request);
      chrome.notifications.create(request.id, request.cn, test)
  }
)


