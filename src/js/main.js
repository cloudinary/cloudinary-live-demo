import { $router } from '../router';
import * as VIEW from '../views/view-names';
import Janus from './janus.js';
import * as ENV from '../env';

// We make use of this 'server' variable to provide the address of the
// REST Janus API. By default, in this example we assume that Janus is
// co-located with the web server hosting the HTML pages but listening
// on a different port (8088, the default for HTTP in Janus), which is
// why we make use of the 'window.location.hostname' base address. Since
// Janus can also do HTTPS, and considering we don't really want to make
// use of HTTP for Janus if your demos are served on HTTPS, we also rely
// on the 'window.location.protocol' prefix to build the variable, in
// particular to also change the port used to contact Janus (8088 for
// HTTP and 8089 for HTTPS, if enabled).
// In case you place Janus behind an Apache frontend (as we did on the
// online demos at http://janus.conf.meetecho.com) you can just use a
// relative path for the variable, e.g.:
//
//      var server = "/janus";
//
// which will take care of this on its own.
//
//
// If you want to use the WebSockets frontend to Janus, instead, you'll
// have to pass a different kind of address, e.g.:
//
//      var server = "ws://" + window.location.hostname + ":8188";
//
// Of course this assumes that support for WebSockets has been built in
// when compiling the gateway. WebSockets support has not been tested
// as much as the REST API, so handle with care!
//
//
// If you have multiple options available, and want to let the library
// autodetect the best way to contact your gateway (or pool of gateways),
// you can also pass an array of servers, e.g., to provide alternative
// means of access (e.g., try WebSockets first and, if that fails, fall
// back to plain HTTP) or just have failover servers:
//
//      var server = [
//          "ws://" + window.location.hostname + ":8188",
//          "/janus"
//      ];
//
// This will tell the library to try connecting to each of the servers
// in the presented order. The first working server will be used for
// the whole session.
//
var server = null;
// server = "wss://" + window.location.hostname + ":8188/janus";
server = `wss://${ENV.CLD_WEB_RTC_HOST}/janus`;

var janus = null;
var cld = null;
var opaqueId = "cldtest-"+Janus.randomString(12);

var started = false;
var spinner = null;
var bandwidth = 1024 * 1024;

var myname = null;
var recording = false;
var recording = false;
var recordingId = null;
var selectedRecording = null;
var selectedRecordingInfo = null;
// var cldApiHost = "api-janus.cloudinary.com";
// var cldResHost = "res-staging.cloudinary.com";
// var cloudName = "dwnkher9d";
// var uploadPreset = "oyncdhbx";

//var cldApiHost = "video-api-staging.cloudinary.com";
//var cldResHost = "live-res-staging.cloudinary.com";
//var cloudName = "dwnkher9d";
//var uploadPreset = "oyncdhbx";

//var uploadType = "upload";
var resourceURI = null;


const initJanus = () => {
    // Initialize the library (all console debuggers enabled)
    
    $router.show(VIEW.VIEW_PROGRESS).text("Initializing the live streaming session...");

    Janus.init({debug: "all", callback: function() {
        // Use a button to start the demo
        //$('#start').click(function() {
        if(started)
            return;

        started = true;

        $(this).attr('disabled', true).unbind('click');
        // Make sure the browser supports WebRTC
        if(!Janus.isWebrtcSupported()) {
            $(".app").trigger("error:general", "The device or browser you are using does not support WebRTC.");
            //bootbox.alert("No WebRTC support... ");
            return;
        }

        // Create session
        janus = new Janus(
            {
                server: server,
                success: function() {
                    // Attach to echo test plugin
                    janus.attach(
                        {
                            plugin: "janus.plugin.cld",
                            opaqueId: opaqueId,
                            success: function(pluginHandle) {
                                cld = pluginHandle;
                                Janus.log("Plugin attached! (" + cld.getPlugin() + ", id=" + cld.getId() + ")");
                                
                                $('.stop-button')
                                .click(function() {
                                    //$router.show(VIEW.VIEW_ENDED);
                                    stop();
                                    //janus.destroy();
                                });
                                
                                $router.show(VIEW.VIEW_MAIN);
                                $(".start-button").click(startRecording);
                            },
                            error: function(error) {
                                Janus.error("  -- Error attaching plugin...", error);
                                $(".app").trigger("error:general","Error attaching plugin... " + error);
                            },
                            consentDialog: function(on) {
                                Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                            },
                            webrtcState: function(on) {
                                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            },
                            onmessage: function(msg, jsep) {
                                Janus.debug(" ::: Got a message :::");
                                Janus.debug(JSON.stringify(msg));
                                var result = msg["result"];
                                if(result !== null && result !== undefined) {
                                    if(result["status"] !== undefined && result["status"] !== null) {
                                        var event = result["status"];
                                        if(event === 'preparing') {
                                            Janus.log("Preparing the recording playout");
                                            cld.createAnswer(
                                                {
                                                    jsep: jsep,
                                                    media: { audioSend: false, videoSend: false, video: 'hires' },  // We want recvonly audio/video
                                                    success: function(jsep) {
                                                        Janus.debug("Got SDP!");
                                                        Janus.debug(jsep);
                                                        var body = { "request": "start" };
                                                        cld.send({"message": body, "jsep": jsep});
                                                    },
                                                    error: function(error) {
                                                        Janus.error("WebRTC error:", error);
                                                        $(".app").trigger("error:general", "WebRTC error... " + JSON.stringify(error));
                                                    }
                                                });
                                            if(result["warning"])
                                                $(".app").trigger("error:general", result["warning"]);
                                        } else if(event === 'recording') {
                                            // Got an ANSWER to our recording OFFER
                                            if(jsep !== null && jsep !== undefined)
                                                cld.handleRemoteJsep({jsep: jsep});
                                            var id = result["id"];
                                            if(id !== null && id !== undefined) {
                                                Janus.log("The ID of the current recording is " + id);
                                                recordingId = id;
                                            }
                                        } else if(event === 'slow_link') {
                                            var uplink = result["uplink"];
                                            Janus.log("Got slow link notification");
                                            if(uplink !== 0) {
                                                // Janus detected issues when receiving our media, let's slow down
                                                bandwidth = parseInt(bandwidth / 1.5);
                                                cld.send({
                                                    'message': {
                                                        'request': 'configure',
                                                        'video-bitrate-max': bandwidth, // Reduce the bitrate
                                                        'video-keyframe-interval': 5000 // Keep the 5 seconds key frame interval
                                                    }
                                                });
                                            }
                                        } else if(event === 'stopped') {
                                            Janus.log("Session has stopped!");
                                            var id = result["id"];
                                            if(recordingId !== null && recordingId !== undefined) {
                                                if(recordingId !== id) {
                                                    Janus.warn("Not a stop to our recording?");
                                                    return;
                                                }
                                                
                                                //bootbox.alert("Recording completed! Check the list of recordings to replay it.");
                                            }
                                            // FIXME Reset status
                                            //$router.show(VIEW.VIEW_ENDED);
                                            //$('#videobox').empty();
                                            //$('#video').hide();
                                            recordingId = null;
                                            recording = false;
                                            cld.hangup();
                                            $('#record').unbind("click").click(startRecording);
                                        }
                                    }
                                } else {
                                    // FIXME Error?
                                    var error = msg["error"];
                                    console.error(error);
                                    $router.view(VIEW.VIEW_ERROR).error(error).action();
                                    //bootbox.alert(error);
                                    // FIXME Reset status
                                    //$('#videobox').empty();
                                    //$('#video').hide();
                                    recording = false;
                                    cld.hangup();
                                    $('#record').unbind("click").click(startRecording);
                                }
                            },
                            onlocalstream: function(stream) {
                                Janus.debug(" ::: Got a local stream :::");
                                Janus.debug(JSON.stringify(stream));
                                
                                $router
                                .show(VIEW.VIEW_RECORDER)
                                .appendVideo('<video class="h-100 w-100" id="thevideo" autoplay muted="muted" playsinline />');
                                $('.stop-button').unbind('click').click(stop);
                                $("#thevideo").get(0).muted = "muted";
                                Janus.attachMediaStream($('#thevideo').get(0), stream);                                
                            },
                            onremotestream: function(stream) {
                                Janus.debug(" ::: Got a remote stream :::");
                                Janus.debug(JSON.stringify(stream));
                                $('#videotitle').html(selectedRecordingInfo);
                                $('.stop-button').unbind('click').click(stop);
                                $('#video').removeClass('hide').show();
                                if($('#thevideo').length === 0) {
                                    $('#videobox').append('<video class="rounded centered hide" id="thevideo" width=320 height=240 autoplay/>');
                                    // No remote video yet
                                    $('#videobox').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
                                    if(spinner == null) {
                                        var target = document.getElementById('videobox');
                                        spinner = new Spinner({top:100}).spin(target);
                                    } else {
                                        spinner.spin();
                                    }
                                }
                                // Show the video, hide the spinner and show the resolution when we get a playing event
                                $("#thevideo").bind("playing", function () {
                                    $('#waitingvideo').remove();
                                    $('#thevideo').removeClass('hide');
                                    if(spinner !== null && spinner !== undefined)
                                        spinner.stop();
                                    spinner = null;
                                });
                                Janus.attachMediaStream($('#thevideo').get(0), stream);
                            },
                            oncleanup: function() {
                                Janus.log(" ::: Got a cleanup notification :::");
                                // hack
                                if(!$router.view(VIEW.VIEW_MAIN).active()) {
                                    $router.show(VIEW.VIEW_ENDED);
                                } 
                                // FIXME Reset status
                                $('#waitingvideo').remove();
                                if(spinner !== null && spinner !== undefined)
                                    spinner.stop();
                                spinner = null;
                                $('#videobox').empty();
                                //$("#videobox").parent().unblock();
                                //$('#video').hide();
                                recording = false;
                                $('#record').removeAttr('disabled').click(startRecording);
                                
                            }
                        });
                },
                error: function(error) {
                    Janus.error(error);
                    $(".app").trigger("error:general", error);
                    // bootbox.alert(error, function() {
                    //     window.location.reload();
                    // });
                },
                destroyed: function() {
                    window.location.reload();
                }
            });
       //});
    }});
};

function checkEnter(field, event) {
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if(theCode == 13) {
        if(field.id == 'name')
            insertName();
        return false;
    } else {
        return true;
    }
}


function startRecording() {
    if(recording)
        return;
    
    $(".restart-recording").unbind("click");
    $(".restart-recording").click(() => {
        $router.view(VIEW.VIEW_MAIN).components("inviteModal").hide();
        recording = false;
    })        

    const params = $router.view(VIEW.VIEW_MAIN).values();
    
    // Start a recording
    recording = true;
    $('#record').unbind('click');
    var headers = new Headers();
    headers.append("X-Requested-With", "XMLHttpRequest");
    var body = new FormData();
    var manifest = {targets: []};
    if (params.hlsTarget) {
        manifest.targets.push({kind: 'hls'});
    }
    if (params.fileTarget) {
        manifest.targets.push({kind: 'file'});
    }
    if (params.facebookUri) {
        manifest.targets.push({kind: 'facebook', uri: params.facebookUri });
    }
    if (params.youtubeUri) {
        manifest.targets.push({kind: 'youtube', uri: params.youtubeUri });
    }


    var json = JSON.stringify(manifest);
    console.info(json);
    var blob = new Blob([json], {type : 'application/json'});
    body.append("file", blob);
    var init = { 
               method: 'POST',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: body };

    const getUploadPreset = () => {
        const values = $router.view(VIEW.VIEW_MAIN).values();
        if(values.opener) {
            return ENV.UPLOAD_PRESET_OPENER;
        } else {
            return ENV.UPLOAD_PRESET;
        }
    }

               
    fetch("https://" + ENV.CLD_API_HOST + "/v1_1/" + ENV.CLOUD_NAME + "/video/" + ENV.UPLOAD_TYPE + "?upload_preset=" + getUploadPreset(), init).then(function(response) {
        if (response.status == 200) {
            return response.json();
        }
        recording = false;
        $('#record').unbind('click').attr('disabled', true);
        var err = "Failed uploading live resource. Response code: " + response.status;
        $(".app").trigger("error:general", err);
        //bootbox.alert(err);
        throw new TypeError(err);
    }).then((result) => {

        $router.view(VIEW.VIEW_MAIN).invite(result.public_id);
       
        $("#continue").unbind("click").click(() => {
            continueRecording(result)   
        });
        
    });
}



function continueRecording(result) {
    // before, after, during recording
    $router.show(VIEW.VIEW_RECORDER).loading();
    resourceURI = "video/" + ENV.UPLOAD_TYPE + "/" + result.public_id;
    
    cld.send({
        'message': {
            'request': 'configure',
            'video-bitrate-max': bandwidth, // a quarter megabit
            'video-keyframe-interval': 5000, // 5 seconds
        }
    });
        
    cld.createOffer(
        {
            // By default, it's sendrecv for audio and video...
            media: {video: 'hires'},
            success: function(jsep) {
                Janus.debug("Got SDP!");
                Janus.debug(jsep);
                var body = { 
                    "request": "record",
                    "cloud-name": ENV.CLOUD_NAME,
                    "resource-uri": resourceURI
                };
                cld.send({"message": body, "jsep": jsep});
                
                //var deliveryURL = getDeliveryUrl(result.public_id);
                //$('#broadcast-link').attr('href', deliveryURL).text(deliveryURL);
            },
            error: function(error) {
                Janus.error("WebRTC error...", error);
                $(".app").trigger("error:general", "WebRTC error... " + error.name + "<br/>" + error.message);
                cld.hangup();
            }
        });
}


function stop() {
    // Stop a recording/playout
    
    $('.stop-button').unbind('click');
    var stop = { "request": "stop" };
    cld.send({"message": stop});
    cld.hangup();
}


export {initJanus, checkEnter, startRecording, continueRecording, stop};
