myURL="about:blank"; //A default url just in case below code doesn't work
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){ //onUpdated should fire when the selected tab is changed or a link is clicked 
    chrome.tabs.getSelected(null,function(tab){
        myURL=tab.url;
    });
});