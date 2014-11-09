

chrome.runtime.sendMessage({
        event: "input"
    },
    function (response) {
        //do stuff with it
        console.log("RRR", response)
        var p = response.pattern;
        if(p != ''){
            p = "." + p;
        }
        document.getElementById("pattern").value = p;
        document.getElementById("hostname").value = response.host;
    }
);