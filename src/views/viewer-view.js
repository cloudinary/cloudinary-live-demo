import View from './view';
//import { $router } from '../router';
import './viewer-view.scss';
import { VIEW_VIEWER, VIEW_ENDED, VIEW_PROGRESS } from './view-names.js';
import NavbarComponent from '../components/navbar-component';
import { createObjFromURI  } from '../utils/location';
import * as ENV from '../env';
//import  cloudinary  from 'cloudinary-core';
//import VideoPlayer from 'cloudinary-video-player';
import { transformationRaw } from '../utils/transformation';
import { $router } from '../router';


const elem = $(`
    <div class="viewer-view h-100 pt-sm-5 pt-md-5 pl-4 pr-4 position-relative">
        <!-- VISIBLE ON MOBILE --> 
        <div class="text-center pt-2 d-block d-sm-none"> 
             <div class="header-logo cld-logo-white d-inline-block position-relative">
                <sup class="header-logo-beta position-absolute">Beta</sup>
             </div>
        </div>

        <div class="video-placeholder"></div>

    </div>
`);

class ViewerView extends View {
    constructor() {
        super(VIEW_VIEWER, elem);
        
        const navbar = new NavbarComponent("body", ".desktop-navbar-placeholder", {
            alwaysShow: false
        });

        
        navbar.el().find(".nav-bar-right").html(`<div class="recorder-bar text-center fixed-top d-flex justify-content-center">
            <div class="d-inline-flex align-items-center justify-content-center status-bar p-2 pl-3 pr-3 m-2 rounded">
                <span class="status-indicator bg-primary flash animated infinite"></span>
                <span class="status-text pl-2">LIVE</span>
            </div>
        </div>`);

        $('<video id="viewer-player" controls autoplay playsinline muted class="cld-video-player"/>').appendTo($(".video-placeholder"));
        
        let firstLoad = true;
        let playerReady = false;
        let muteBtnRender = false;
        const muteBtn = $(`<i class="mute-btn-additional position-absolute material-icons md-24">volume_off</i>`);
        
        const addSourceAndPlay = () => {
            const qs = createObjFromURI();
            
            player.source(qs.view_id, { 
                sourceTypes: ['hls'], 
                format: "m3u8",
                type: ENV.UPLOAD_TYPE, 
                raw_transformation: transformationRaw(qs)
            }).play();
        }

        const addMuteButton = () => {
            muteBtn.appendTo(player.el());
            
            muteBtnRender = true;
            muteBtn.click(() => {
                if(player.isMuted()) {
                    player.unmute();
                    muteBtn.text("volume_up");
                } else {
                    player.mute();
                    muteBtn.text("volume_off");
                }
            });
        }

        const cld = cloudinary.Cloudinary.new({ 
            cloud_name: ENV.CLOUD_NAME_IMAGES
            //secure_distribution: ENV.CLD_RES_HOST
        }); 

        const player = cld.videoPlayer('viewer-player',{
            fluid: true,
            videojs: {
                html5: { 
                    hls: { overrideNative: true }
                }
            },
            analytics: { 
                events: [
                    'play',
                    'pause',
                    'playerload',
                    'fullscreenchange'
                ]
            },
            posterOptions: {
                publicId: "live-video-streaming"
            }
        }, () => {
            addSourceAndPlay();
        });

        player.on("volumechange", () => {
            if(!player.isMuted()) {
                muteBtn.text("volume_up");
            } else {
                muteBtn.text("volume_off");
            }
        })

        player.on("loadedmetadata", () => {
            console.log("loadedmetadata");
            playerReady = true;
            $router.show(VIEW_VIEWER);
            player.play();

            if(!muteBtnRender) {
                addMuteButton();
            }
        })

        // player.on("play", () => console.log("play") );
        // player.on("abort", () => console.log("abort") );
        // player.on("canplay", () => console.log("canplay") );
        // player.on("canplaythrough", () => console.log("canplaythrough") );
        // player.on("ended", () => console.log("ended") );
        // player.on("loadeddata", () => console.log("loadeddata") );
        // player.on("loadstart", () => console.log("loadstart") );
        // player.on("progress", () => console.log("progress") );
        // player.on("stalled", () => console.log("stalled") );
        // player.on("suspend", () => console.log("suspend") );
        // player.on("waiting", () => console.log("waiting") );
        // player.on("volumechange", () => console.log("volumechange") );
        // player.on("stop",  () => console.log("stop") );
        // player.on("pause", () => console.log("pause") );
        player.on("error", () => console.log("error"))

        this.show = () => {
            super.show();
            if(firstLoad) {
                $router.show(VIEW_PROGRESS).text("Hang on a second. We’re loading the video stream you requested.");
                firstLoad = false;
            }
            
        }

        const interval = setInterval( () => {
            if(!playerReady) {
                addSourceAndPlay();
            } else {
                clearInterval(interval);
            }
        },1000);
    }

}; 



export default ViewerView;