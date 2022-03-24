// documentation @ https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize?hl=en_US

/** Variables for JSON objects -- data types are the api is expecting **/
var textToRead="hello there"; //string
var languageCode=[]; //string
var voiceName=""; //string
var ssmlVoiceGender="MALE"; //enum
const audioEncoding="MP3"; //enum
var speakingRate=""; //double
var pitch=""; //double
var volumeGainDb=""; //double
var sampleRateHertz=""; //int
var audioContent=""; //string
//TTS POST api url
const apiPostUrl= 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyB8iMziuh0HrpQC26c6u3nbFSgP8L0wyro';
// TTS GET voices list (languageCode = en, so only getting english voices right now)
const getVoicesUrl = 'https://texttospeech.googleapis.com/v1beta1/voices?languageCode=en&key=AIzaSyB8iMziuh0HrpQC26c6u3nbFSgP8L0wyro';
var base64string="";
var voiceList =[];
var voiceListJson="";
var voiceListObj="";
document.addEventListener('DOMContentLoaded', function(event) {

    /**** input, voice, and audioConfig are the required objects to pass into the API
     * input.text, voice.languageCode, and audioConfig.audioEncoding are all mandatory parameters
     * everything else that is commented beneath the objects is optional for picking voices
     * or altering the audio, etc. ****/
    var input = {}
    var voice = {}
    var audioConfig ={}

    //** this casts the objects into JSON strings for api
    var formBody= {input, voice, audioConfig}
    var form  = JSON.stringify(formBody);

    //** object to receive audioContent response from api call
    var responseBody = {}

    //** object to receive voice object array from api call
    var voiceListBody = {};

    //** GET tts voice list call, returns object with array, then puts array in voiceList
    axios.get(getVoicesUrl)
        .then(function (response) {
            console.log(response);
            voiceListBody = response.data;
            console.log("voiceListBody: " + voiceListBody);
            voiceList = voiceListBody.voices;
            console.log("voiceList: " + voiceList);
        })
        .catch(function (error) {
            console.log(error);
        });

    document.getElementById("submit_text").addEventListener("click", function(){

        //console.log("voiceList array: " + JSON.stringify(voiceList[0]));
        console.log("voiceList[0] name: " + voiceList[1].name
            + "\nvoiceList[0] langCode: " + voiceList[3].languageCodes
            + "\nvoiceList[0] ssmlGender: " + voiceList[5].ssmlGender
            + "\nvoiceList[0] naturalSampleRate: " + voiceList[8].naturalSampleRateHertz);

        //** readstr gets text from the textbox in prototype extension
        var readstr = document.getElementById("test_read").value;
        console.log("got text box info: " + readstr);

        //** pick random voice
        var randomIndex = Math.floor(Math.random() * voiceList.length);
        console.log('rando index: '+ randomIndex);
        languageCode = JSON.stringify(voiceList[randomIndex].languageCodes);
        voiceName = voiceList[randomIndex].name;
        ssmlVoiceGender = voiceList[randomIndex].ssmlGender;
        sampleRateHertz = voiceList[randomIndex].naturalSampleRateHertz;

        //mandatory
        input.text = readstr.toString();

        //languageCode mandatory, other 2 optional
        voice.languageCode = languageCode.toString();
        voice.name = voiceName.toString();
        voice.ssmlGender = ssmlVoiceGender.toString();

        //audioEncoding mandatory, others optional
        audioConfig.audioEncoding = audioEncoding.toString();
        // audioConfig.speakingRate = speakingRate.toString()
        // audioConfig.pitch = pitch.toString()
        // audioConfig.volumeGainDb = volumeGainDb.toString()
        audioConfig.sampleRateHertz = sampleRateHertz.toString()
        // "effectsProfileId": [
        //     string
        // ]

        //** Axios style post request to receive audio string--  working, preferred
        axios.post(apiPostUrl, {
            input, voice, audioConfig
        })
            .then(function (response) {
                console.log(response);
                responseBody = response.data;
                base64string = responseBody.audioContent;
                console.log("base64 string: " + base64string);
                var audioClip = new Audio('data:audio/mp3;base64,' + base64string);
                audioClip.play();
            })
            .catch(function (error) {
                console.log(error);
            });
    });
})

//** Old XMLHttp style http post request for api call -- working
// let xhr = new XMLHttpRequest();
// xhr.open("POST", apiPostUrl);
// xhr.setRequestHeader("Accept", "application/json");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4) {
//         console.log(xhr.responseText);
//         responseBody = JSON.parse(xhr.response);
//
//     }};
// xhr.send(form);