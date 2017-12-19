import View from './view';
import { VIEW_PROGRESS } from './view-names.js';
import './progress-view.scss';

const elem = $(`
    <div class="progress-view d-none h-100">
        <div class="d-flex flex-column justify-content-between h-100">
            <div class="pl-4 pr-4">
                <div class="text-center pt-2 d-block d-sm-none"> 
                    <div class="header-logo cld-logo-white d-inline-block position-relative">
                        <sup class="header-logo-beta position-absolute">Beta</sup>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center">
                <div class="spinner loading"></div>
                <div class="loading-text pt-4 text-center w-75"></div>
            </div>
            <div></div>
        </div>
    </div>
`);

class ProgressView extends View {
    constructor() {
        super(VIEW_PROGRESS, elem);
        
        const _text = this.el.find(".loading-text");

        this.text = (text = '') => {
            if(text !== '') {
                _text.html(text);
            }
        }
    }
};

export default ProgressView;