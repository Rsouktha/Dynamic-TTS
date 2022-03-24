document.addEventListener('DOMContentLoaded', function(event) {
    var input = {}
    var voice = {}
    var audioConfig ={}

    //** this casts the objects into JSON strings for api
    var formBody= {input, voice, audioConfig}
    var form  = JSON.stringify(formBody);

    //** object to receive audioContent response from api call
    var responseBody = {}

    
    document.getElementById("readThreadTestButton").addEventListener("click", function(){
        let readstr = readThread[1].author + " says " + readThread[1].body; 
        readComment(readstr);
    });

    function readComment(readstr) {
                //mandatory
                input.text = readstr.toString();

                //languageCode mandatory, other 2 optional
                voice.languageCode = languageCode.toString()
                // voice.name = voiceName.toString()
                // voice.ssmlGender = ssmlVoiceGender.toString()
        
                //audioEncoding mandatory, others optional
                audioConfig.audioEncoding = audioEncoding.toString()
                // audioConfig.speakingRate = speakingRate.toString()
                // audioConfig.pitch = pitch.toString()
                // audioConfig.volumeGainDb = volumeGainDb.toString()
                // audioConfig.sampleRateHertz = sampleRateHertz.toString()
                // "effectsProfileId": [
                //     string
                // ]
        
                //** Axios style post request --  working, preferred
                axios.post(apiPostUrl, {
                    input, voice, audioConfig
                })
                    .then(function (response) {
                        console.log(response);
                        responseBody = response.data;
                        base64string = responseBody.audioContent;
                        console.log("base64 string: " + base64string)
                        var audioClip = new Audio('data:audio/mp3;base64,' + base64string);
                        audioClip.play();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
    }
}); 