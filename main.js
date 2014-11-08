//TODO: Get from server
var database = {
    "echo.newtechnetwork.org":["div.title-row > h2 > a"]   
}

var allevents = database[document.location.hostname]
console.log(allevents, $(allevents));