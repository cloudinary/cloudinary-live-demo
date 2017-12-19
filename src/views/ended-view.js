import View from './view';
import { $router } from '../router';
import { jsSocialPopover } from '../utils/share';
import { VIEW_ENDED, VIEW_MAIN } from './view-names.js';
import './ended-view.scss';



const elem = (`
    <div class="ended-view d-none h-100">
        <div class="d-flex flex-column justify-content-between h-100">
            <div class="pl-4 pr-4">
                <div class="text-center pt-2 d-block d-sm-none"> 
                    <div class="header-logo cld-logo-white d-inline-block position-relative">
                        <sup class="header-logo-beta position-absolute">Beta</sup>
                    </div>
                </div>

                <h4 class="name-of-stream text-primary font-weight-light mb-3 mt-3 text-center">"Name of Stream"</h4>
                <h4 class="font-weight-light mb-5 mt-4 text-center">Live Stream Ended</h4>

                <hr class="m-0"/>
                <button href="#" class="btn btn-link share pt-4 pb-4 w-100 text-left">
                    <i class="material-icons md-24 checked pr-3">share</i>
                    Share    
                </button>
                <hr class="m-0"/>
                <a href="#" target="_blank" class="btn btn-link pt-4 pb-4 w-100 text-left watch-again">
                    <i class="material-icons md-24 checked pr-3">play_circle_outline</i>
                    Watch Again
                </a>
                <hr class="m-0"/>
                <button class="btn btn-link pt-4 pb-4 w-100 text-left new-stream">
                    <i class="material-icons md-24 checked pr-3">videocam</i>
                    New Stream
                </button>
                <hr class="m-0"/>
            </div>
            
            <div class="read-more text-center pt-4 pb-5">
                <div class="cld-logo-with-text"></div>
                <p>Read more @ Cloudinary</p>
                <a href="https://cloudinary.com/users/register/free" target="_blank" class="btn btn-primary btn-lg">SIGN UP FOR FREE</a>
            
            </div>
        </div>
        
    </div>
`);

class EndedView extends View {
    constructor() {
        super(VIEW_ENDED, elem);
        
        const _watchAgain = this.el.find(".watch-again");
        const _share = this.el.find(".share");

        _watchAgain.click(() => {
            //$router.show(VIEW_MAIN).clear();
        })

        this.el.find(".new-stream").on("click", () => {
            $router.show(VIEW_MAIN).clear();
        });

        const setUri = () => {
            const uri = $router.view(VIEW_MAIN).uri();
            
            if(uri) {
                _watchAgain.attr("href", uri);
            } else {
                _watchAgain.attr("href","#");
                console.warn("Ended pages is visible but no uri");
            }
        }

        const setStreamName = () => {
            const values = $router.view("main").values();
            this.el.find(".name-of-stream").html(values.streamName);
        }

        const setSocial = () => {
            jsSocialPopover(this.el.find(".share"));
            // hack for safari mobile - focus doesnt work - need to force trigger
            _share.click(()=>{
                _share.trigger("focus");
            });
        }

        this.show = () => {
            super.show();
            setStreamName();
            setUri();
            setSocial();
        }
        
    }

    
    
};

export default EndedView;