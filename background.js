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
function clickHandler(info) {
    console.log("callback!");
        chrome.tabs.sendMessage(tab.id, "getClickedEl", function (clickedEl) {
            elt.value = clickedEl.value;
        });
}
chrome.contextMenus.create({
        "title": "Make this an Achievement",
        "contexts": ["all"],
        "onclick": clickHandler
    }
        
);