chrome.contextMenus.create({
    "title": "Buzz This",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : clickHandler
  });

function clickHandler(i){
    alert("here")   
}