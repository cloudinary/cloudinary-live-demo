import Component from './component';
import { jsSocialPopover } from '../utils/share';
import '../scss/control-bar.scss';



const btnLeft = `<button class="btn-share btn btn-icon m-2 invisible">
                    <i class="material-icons md-18 pr-2">share</i>
                </button>`;

const btnRight = `<button class="btn-mute btn btn-icon m-2 invisible">
                    <i class="material-icons md-18 pr-2">mic_off</i>
                </button>`;

const btnStart = `<button id="start" class="start-button btn-round btn-secondary btn flex-row justify-content-center align-items-center border-white font-weight-light">
                    <i class="material-icons md-24 text-white">arrow_forward</i>
                 </button>`;

const btnStop = `<button id="stop" class="stop-button btn-round btn-primary btn flex-row justify-content-center align-items-center border-white font-weight-light">
                    <i class="material-icons md-24 text-white">stop</i>
                </button>`;

const startTpl = [btnStart].join("");
const endTpl = [btnLeft, btnStop, btnRight].join(""); 

const ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
const SLIDE_IN = "xanimated xslideInUp";
const SLIDE_OUT = "xanimated xdelay xslideOutDown";

class ControlBarComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {}) {
        const button = options.start ? btnStart : btnStop;
        const actions = options.start ? '' : [btnLeft, btnRight].join("");
        const responsiveCls = ""; //options.start ? "d-sm-none" : "";
        const _el =  $(`
            <div class="control-bar fixed-bottom pl-2 pr-2 text-center ${ responsiveCls }">
                ${button}
                <div class="w-100 position-absolute action-bar d-flex flex-row justify-content-between">${actions}</div>        
            </div>
        `);

        super(viewInstance, placeholderSelector, _el, options);      
        
        this.cls = options.start ? "justify-content-center" :  "justify-content-between";
        

       
        
        this._animationState =  false;

        $("body").on("view:hide", () => {
            this._animationState =  false;
        });

        this.social = () => {
            _el.find(".btn-share").popover("dispose");
            jsSocialPopover(_el.find(".btn-share"),{
                placement: "top"
            });

            return this;
        }


    }
    show () {
        this.el()
        .removeClass("d-none")
        .removeClass(SLIDE_OUT)
        .removeClass(SLIDE_IN);
        return this;      
    }

    hide() {
        this.el()
        .removeClass(SLIDE_OUT)
        .removeClass(SLIDE_IN)
        .addClass("d-none");

        return this;
    }

    hideStop() {
        this.el().find(".stop-button").addClass("invisible");
        
        return this;
    }

    showStop() {
        this.el().find(".stop-button").removeClass("invisible");  
        
        return this;
    }
    
    showButtons() {
        this.el().find(".btn-icon").removeClass("d-none");
        this.el().removeClass("justify-content-center").addClass("justify-content-between");

        return this;
    }

    hideButtons() {
        this.el().find(".btn-icon").addClass("d-none");
        this.el().removeClass("justify-content-between").addClass("justify-content-center");

        return this;
    }

    hideAnimated() {
        if(!this._animationState && !this.el().hasClass("d-none")) {
            this._animationState = true;

            this
            .show()
            .el()
            .addClass(SLIDE_OUT)
            .one(ANIMATION_END, (elem) => {
                this.hide().el().removeClass(SLIDE_OUT);
                this._animationState = false;
            });
        }

        return this;
    }

    showAnimated() {
        if(!this._animationState && this.el().hasClass("d-none")) {
            this._animationState = true;
            
            this
            .show()
            .el()
            .addClass(SLIDE_IN)
            .one(ANIMATION_END, (elem) => {
                this.el().removeClass(SLIDE_IN); 
                this._animationState = false;
                this.hideAnimated();
            });
        }  

        return this;
    }
}

export default ControlBarComponent;