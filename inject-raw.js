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
            if (typeof r == 'string') {
                r = JSON.parse(r);
            }
            if (r.error != undefined) {
                console.log('Already Got!');
                return;
            } else {
                console.log(r);
                $('head').prepend("<link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>")
                $('body').prepend('<div id="noti"></div>');
                //$('#noti').prepend('<img src="https://files.helloben.co/upload/uploads/f545ed87fbf9c1.png"/>')
                $('#noti').prepend('<h3 id="title"><h3>');
                $('#noti').append('<h5 id="desc"></h5>');
                $('#title').text(r.title);
                $('#desc').text(r.desc);
                setTimeout(function () {
                    $('#noti').fadeOut();
                }, 5000);
            }

        }
    });
}