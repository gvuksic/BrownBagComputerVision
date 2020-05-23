    $(document).ready(function () {

        var video = document.getElementById("video");
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.srcObject = stream;
                video.play();
            });
        }

        window.setInterval(function(){
            context.drawImage(video, 0, 0, 640, 480);

            fetch(canvas.toDataURL("image/png"))
                .then(res => res.blob())
                .then(blob => processImage(blob));
        }, 5000);

        function processImage(blobImage) {
            var subscriptionKey = "COMPUTER_VISION_SUBSCRIPTION_KEY";
            var endpoint = "COMPUTER_VISION_ENDPOINT";
            var uriBase = endpoint + "vision/v3.0/analyze";

            var params = {
                "visualFeatures": "Categories,Description,Color",
                "details": "",
                "language": "en",
            };

            $.ajax({
                url: uriBase + "?" + $.param(params),
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },
                type: "POST",
                cache: false,
                processData: false,
                data: blobImage
            })
                .done(function(data) {
                    document.getElementById('AIresponse').innerHTML = data.description.captions[0].text;
            });
        }

    });