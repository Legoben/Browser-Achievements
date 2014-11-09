function BA_Click(id, userid, url) {
    $.ajax({
        url: 'https://ba.ngrok.com/ca',
        data: {
            uid: userid,
            aid: id,
            url: document.location.hostname
        },
        xhr: function () {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function (name, value) {
                if (name == 'X-Requested-With') return;
                setRequestHeader.call(this, name, value);
            }
            return xhr;
        },
        success: function (r) {
            if(typeof r == 'string'){
                r = JSON.parse(r);
            }
            if(r.error != undefined){
                console.log('Already Got!');
                return;
            }else{
                console.log(r);
                console.log('Sorry, Such Win!');
            }
            
        }
    });
}