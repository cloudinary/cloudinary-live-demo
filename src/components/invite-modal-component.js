

import Component from './component';
import InputTextComponent from './input-text-component';
import { jsSocial } from '../utils/share';
import { $router } from '../router';
import { VIEW_MAIN } from '../views/view-names';
import Clipboard from 'clipboard';

const ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

const elem = () => {
    return $(` 
        <div class="invite-modal position-absolute w-100 h-100 pt-5 pb-5 pl-4 pr-4 d-none">
            <div class="invite-modal-content h-100 w-100 d-flex flex-column justify-content-between">
                <div class="text-right text-right pt-2 pb-0 pr-2">
                    <button class="close restart-recording close-button btn btn-transparent btn-icon">
                        <i class="material-icons md-18 pr-2">close</i>
                    </button>
                </div>
                <div>
                    <h4 class="p-4 text-center">Invite people to watch your live stream</h4>
                    <hr/>
                </div>
                <div>
                    <div class="p-2 pt-4 pb-4">
                        <div class="share-url-placeholder"></div>
                        <div class="text-center">
                            <button class="copy-to-clipboard btn btn-link p-2" style="font-size: 0.8rem;">Copy link to clipboard</button>
                        </div>
                    </div>
                </div>
                <div class="social text-center"></div>
                <div style="flex:1;"></div>
                <div>
                    <hr/>
                    <div class="p-4 text-center">
                        <div class="mb-4">
                            <small>Clicking the button below will start your streaming session. Are you ready to go live?</small>
                        </div>
                        <button id="continue" class="btn-start-lg start-live-stream btn-secondary btn flex-row justify-content-center align-items-center border-white font-weight-light">
                            <i class="material-icons md-24 text-white mr-2">videocam</i>
                            <span>Start Streaming</span>
                        </button>
                    </div>
                </div>
            </div>
        </div> 
    `);
} 

class InviteModalComponent extends Component {
    constructor( viewInstance, placeholderSelector ) {
        const _el = elem();
        super(viewInstance, placeholderSelector, _el);               
         
        const _input = new InputTextComponent(_el, ".share-url-placeholder", {
            label: "URL",
            readonly: true,
            id: "share-url-field"
        })

        new Clipboard('.copy-to-clipboard', {
            text: function(trigger) {
                return $("#share-url-field").val();
            }
        });

        _input.input().click((e) => {
            _input.input().select();
        });

        this.setSocial = (uri) => {
            jsSocial(_el.find(".social").empty(), uri);
            
            return this;
        }

        this.setUri = (uri) => {
            _input.val(uri);

            return this;
        }

        this.show = () => {
            _el
            .removeClass("d-none")
            .addClass("animated slideInDown")
            .one(ANIMATION_END, () => _el.removeClass("animated slideInDown"));

            $router.view(VIEW_MAIN).el.addClass("is-modal");
            $(".content-container").addClass("is-modal");

        }

        this.hide = () => {
            if(!_el.hasClass("d-none")) {
                _el
                .addClass("d-none")
                //.addClass("animated slideOutUp")
                //.one(ANIMATION_END, () => _el.removeClass("animated slideOutUp").addClass("d-none") );
                
                $router.view(VIEW_MAIN).el.removeClass("is-modal");
                $(".content-container").removeClass("is-modal");
            }
            
        }

    }
};

export default InviteModalComponent;

