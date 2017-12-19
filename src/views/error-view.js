import View from './view';
import { $router } from '../router';
import './error-view.scss';
import { VIEW_ERROR, VIEW_MAIN } from './view-names.js';


// An error occurred. Error details: 

const elem = $(`
    <div class="ended-view d-none h-100">
        <div class="d-flex flex-column justify-content-between h-100">
            <div class="pl-4 pr-4">
                <div class="text-center pt-2 d-block d-sm-none"> 
                    <div class="header-logo cld-logo-white d-inline-block position-relative">
                        <sup class="header-logo-beta position-absolute">Beta</sup>
                    </div>
                </div> 
            </div>
            <div class="p-4 m-4 rounded bg-opacity">
                <div class="d-flex flex-row align-items-center">
                    <i class="material-icons md-48 pr-3">error_outline</i>
                    <div class="text-left align-middle">
                        <h4>Oops... Something went wrong. Details:</h4>
                        <small class="error-msg"></small>
                    </div>
                </div>
                <hr/>
                <div class="mt-5 mb-3 text-center">
                    <button class="back btn btn-white"></button>
                </div>
            </div>
            <div></div>
        </div>
    </div>
`);

class ErrorView extends View {
    constructor() {
        super(VIEW_ERROR, elem);
        
        this.msg = this.el.find(".error-msg");
        this.backBtn = this.el.find(".back");

        this.backBtn.click(() => {
            $router.show("main");
        });
        
    }

    error(msg) {
        $router.show(this.name);
        this.backBtn.addClass("d-none");    
        this.msg.html(msg);

        return this;
    }

    action( callback, text = "Try Again") {
        this.backBtn
        .unbind("click")
        .removeClass("d-none")
        .html(text);
         
        if( !callback ) {    
            this.backBtn.click(() => window.location.reload());
        } else {
            this.backBtn.click(callback);
        }

        return this;
    }
}; 

export default ErrorView;