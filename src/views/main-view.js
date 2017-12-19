
import View from './view';
import NavbarComponent from '../components/navbar-component';
import CheckboxComponent from '../components/checkbox-component';
import LogoCheckboxComponent from '../components/logo-checkbox-component';
import RadioComponent from '../components/radio-component';
import UrlPanelComponent from '../components/url-panel-component';
import ControlBarComponent from '../components/control-bar-component';
import InviteModalComponent from '../components/invite-modal-component';
import InputTextComponent from '../components/input-text-component';
import { VIEW_MAIN } from './view-names';
import { transformation } from '../utils/transformation';
import { getVideoViewUri } from '../utils/location';
 
import './main-view.scss';

// <input class="d-none" type="checkbox" name="fileTarget" checked="true"/>

const elem = $(`
<div class="main-view pl-4 pr-4 d-none position-relative">
    <div class="invite-modal-placeholder"></div>
    <form>
        <input class="d-none" type="checkbox" name="fileTarget" checked="true"/> 
        <input class="d-none" type="checkbox" name="hlsTarget" checked="true"/>
        <input class="d-none" type="checkbox" name="broadcastLink" value="" checked="true"/>
        <div class="control-placeholder"></div>
        <!-- VISIBLE ON MOBILE --> 
        <div class="text-center pt-2 d-block d-sm-none"> 
            <div class="header-logo cld-logo-white d-inline-block position-relative">
                <sup class="header-logo-beta position-absolute">Beta</sup>
            </div>
        </div>

        <div class="stream-name-placeholder"></div>
        
        <!-- EFFECTS SECTION -->
        <h4 class="font-weight-light mb-3">Effects</h4>

        <div class="effects-wrap">
        <!-- LOGO -->
        <div class="logo-placeholder"></div>
        <!-- OPENER -->
        <div class="d-flex align-items-center justify-content-between">
            <div class="opener-placeholder"></div>
        </div>
        <!-- VIGNETTE -->
        <div class="vignette-placeholder"></div>
        <!-- BLUR -->
        <div class="blur-placeholder"></div>
        </div>

        <hr></hr>

        <!-- STREAM TO SOCIAL SECTION -->
        <h4 class="font-weight-light mb-3">Stream to social media</h4>
        <div class="no-stream-placeholder"></div>    
        <!-- FACEBOOK -->
        <div class="facebook-placeholder"></div>
        <div class="facebook-url-placeholder"></div>
        <!-- YOUTUBE -->
        <div class="youtube-placeholder"></div>
        <div class="youtube-url-placeholder"></div>
        <hr/>
        <div class="stream-no-sound-placeholder"></div>
        <div class="m-4"></div>
        <div style="height:48px;"></div>
    </form>
</div>
`);




const FORM_DEFAULTS = {
    logo: false,
    noStream: true,
    streamName: "My live video",
    facebookUrl: "",
    youtubeUrl: ""
}

const setDefaults = (components = {}) => {
    $.each(components, (componentName, instance) => {
        if(FORM_DEFAULTS[componentName]) {
            if(instance instanceof InputTextComponent || instance instanceof UrlPanelComponent) {
                instance.val(FORM_DEFAULTS[componentName] || "");
            }

            if(instance instanceof CheckboxComponent || instance instanceof RadioComponent || instance instanceof LogoCheckboxComponent) {
                instance.check();
            }
        }
    })
}

const initComponents = function () {
    
    const streamToChangeHandler = (e) => {
        const elem = e.target ? $(e.target) : e;
        
        $(elem.attr("data-panel-show-ref"))
        .removeClass("d-none")
        .addClass("animated pulse")
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', (elem) => {
            $(elem.target).removeClass("fadeInDown").find("input").focus(); 
        });
        
        elem.attr("data-panel-hide-ref").split(",").forEach( (elem) => {
            $(elem).addClass("d-none").find("input").val("");
        });
    }

    let components = {
        streamName: new InputTextComponent(this, ".stream-name-placeholder", {
            label: "Live streaming title", 
            name: "streamName"
        }),
        controlBar: new ControlBarComponent(this, ".control-placeholder", { start: true }),
        navbar: new NavbarComponent("body", ".desktop-navbar-placeholder"),
        inviteModal: new InviteModalComponent(this, ".invite-modal-placeholder"),
        logo: new LogoCheckboxComponent(this, ".logo-placeholder", { text: "Add your logo" }),
        opener: new CheckboxComponent(this, ".opener-placeholder", { text: "Add intro animation", name: "opener", icon: "slideshow" }),
        vignette: new CheckboxComponent(this, ".vignette-placeholder", { text: "Apply vignette border", name: "vignette", icon: "vignette" }),
        blur: new CheckboxComponent(this, ".blur-placeholder", { text: "Blur your video", name: "blur", icon: "blur_on"}),
        //streamSound: new CheckboxComponent(this,".stream-no-sound-placeholder", { text: "Stream without sound", name: "noSound", icon: "volume_off"}),
        noStream: new RadioComponent(this, ".no-stream-placeholder", { 
            text: "None",
            name: "streamTo",
            panelHideRef: "#youtube-url-panel, #facebook-url-panel",
            on: {
                change: streamToChangeHandler
            }
        }),
        facebook: new RadioComponent(this, ".facebook-placeholder", { 
            text: "Facebook", 
            icon: "facebook", 
            localIcon: true, 
            name: "streamTo", 
            panelShowRef: "#facebook-url-panel",
            panelHideRef: "#youtube-url-panel",
            on: {
                change: streamToChangeHandler
            }
        }),
        facebookUrl: new UrlPanelComponent(this, ".facebook-url-placeholder", { 
            id: "facebook-url-panel", 
            name: 'facebookUri', 
            hidden: true, 
            info: "Enter the Server URL and Stream Key separated by a slash (/), available from the Facebook Create Live Stream page.",
            placeholder: "rtmp://"
        }),
        youtube: new RadioComponent(this, ".youtube-placeholder", { 
            text: "YouTube",  
            icon: "youtube", 
            localIcon: true, 
            name: "streamTo" , 
            panelShowRef: "#youtube-url-panel",
            panelHideRef: "#facebook-url-panel",
            on: {
                change: streamToChangeHandler
            }
        }),
        youtubeUrl: new UrlPanelComponent(this, ".youtube-url-placeholder", { 
            id: "youtube-url-panel", 
            name: 'youtubeUri', 
            hidden: true,
            info: "Enter the Server URL and Stream Key separated with a slash (/), available from your YouTube Live Dashboard.",
            placeholder: "rtmp://"
        })
    };

    components.inviteModal.el().appendTo(".content-container");
    //window.components = components;

    return components;
}



const initEvents = (el) => {

    el.submit(function(e){
        e.preventDefault();
    });


    // Stream To

    // $("input[name=streamTo]").on("change",(e) => {
    //     const elem = $(e.target);
    //     $(elem.attr("data-panel-show-ref"))
    //     .removeClass("d-none")
    //     .addClass("animated pulse")
    //     .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', (elem) => {
    //         $(elem.target).removeClass("fadeInDown").find("input").focus(); 
    //     });
        
    //     elem.attr("data-panel-hide-ref").split(",").forEach( (elem) => {
    //         $(elem).addClass("d-none").find("input").val("");
    //     }) 
        
    // })
}

class MainView extends View {
    constructor() {
        super(VIEW_MAIN, elem);
        const _components = initComponents.call(this);
        let _shareUri;
        
        initEvents(this.el);
        
        // Show invite view overlay
        this.invite = (publicId) => {
            _shareUri = getVideoViewUri(publicId, this.values());
            _components.inviteModal
            .setSocial(_shareUri)
            .setUri(_shareUri)
            .show();
            
            return this;
        }

        this.show = () => {
            super.show();       
            _components.inviteModal.hide();
        }

        this.hide = () => {
            super.hide();       
            _components.inviteModal.hide();
        }


        this.uri = () => {
            return _shareUri || "";
        }

        this.components = (name) => {
            return  _components[name];
        }

        this.clear = () => {
            _shareUri = "";
            setDefaults(_components);

            return this;
        }

        this.clear();
    } 

    transformation() {
        const valuesHash = this.values();

        return transformation(this.values());
    }

    values() {
        const valuesHash = {};
        this.el.find("input").each((index,input) => {
            if(input.value !== '' && input.name !== '') {
                if(input.type.toLowerCase() === "checkbox" || input.type.toLowerCase() === "radio") {
                    if(input.checked) {
                        // TODO: need to change
                        if(input.name === "logo" && input.value === "on") {
                            return;
                        }

                        if(input.name === "streamTo" && input.value === "") {
                            return;
                        }

                        valuesHash[input.name] = input.value!= "" ? input.value :  true;        
                    }
                } else {
                    valuesHash[input.name] = input.value;    
                }
            }
        })

        return valuesHash;
    }

};

export default MainView;