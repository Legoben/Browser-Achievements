function uniqid(prefix, more_entropy) {
    //  discuss at: http://phpjs.org/functions/uniqid/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kankrelune (http://www.webfaktory.info/)
    //        note: Uses an internal counter (in php_js global) to avoid collision
    //        test: skip
    //   example 1: uniqid();
    //   returns 1: 'a30285b160c14'
    //   example 2: uniqid('foo');
    //   returns 2: 'fooa30285b1cd361'
    //   example 3: uniqid('bar', true);
    //   returns 3: 'bara20285b23dfd1.31879087'

    if (typeof prefix === 'undefined') {
        prefix = '';
    }

    var retId;
    var formatSeed = function (seed, reqWidth) {
        seed = parseInt(seed, 10)
            .toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
            return Array(1 + (reqWidth - seed.length))
                .join('0') + seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    if (!this.php_js) {
        this.php_js = {};
    }
    // END REDUNDANT
    if (!this.php_js.uniqidSeed) { // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    this.php_js.uniqidSeed++;

    retId = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date()
        .getTime() / 1000, 10), 8);
    retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10)
            .toFixed(8)
            .toString();
    }

    return retId;
};
//store id function
function setID() {
    var id = uniqid();
    chrome.storage.local.set({
        'id': id
    }, function () {
        console.log('Your ID has been saved. It is: ' + id);
        $.ajax({
            url: 'https://ba.ngrok.com/newuser',
            data: {
                uid: id
            },
            success: function() {
                console.log("User Registered with Server!");
            }
        });
    });
};
//if user does not have id then assign them one
function checkID() {
    chrome.storage.local.get('id', function (id) {
        if (jQuery.isEmptyObject(id) == false) {
            userid = id;
            main();
        } else {
            setID();
            checkID();
        }
    });
};
//remove an id
function removeID() {
    chrome.storage.local.remove('id', function () {
        console.log("ID removed")
    })
};

var userid = null;
checkID();

function main() {
    console.log(userid);
    var allevents;
    $.ajax({
        url: 'https://ba.ngrok.com/getpatterns',
        data: {
            url: document.location.hostname,
            id: userid.id
        },
        success: function (r) {
            allevents = r
            console.log(allevents);
            for (var i = 0; i < allevents.length; i++) {
                console.log("here")
                $(allevents[i].pattern).each(function () {
                    $(this).attr("onclick", "BA_Click('" + allevents[i].id + "','" + userid.id + "')");
                });
            }
        }
    });



}
var s = document.createElement('script');
s.src = chrome.extension.getURL('inject-raw.js');
s.onload = function () {
    this.parentNode.removeChild(this);
};

(document.head || document.documentElement).appendChild(s);