function BA_Click(id){
    //Send to server   
}


//TODO: Get from server
var database = {
    "echo.newtechnetwork.org":[{"pattern":"div.title-row > h2 > a", "id":"sfkns"}]   
}

var allevents = database[document.location.hostname]
console.log(allevents);

for(var i = 0; i < allevents.length; i++){
    console.log("here")
    $(allevents[i].pattern).each(function(){
        $(this).attr("onclick","BA_Click('"+allevents[i].id+"')");   
    });
}
