import View from './view';
import ControlBarComponent from '../components/control-bar-component';
import { VIEW_RECORDER } from './view-names.js';
import './recorder-view.scss';


const elem = $(`
    <div class="recorder-view d-none">
        <div class="control-placeholder" style="display:none;"></div>
        <div class="recorder-bar text-center fixed-top d-flex justify-content-center d-none" style="display:none;">
            <div class="d-inline-flex align-items-center justify-content-center status-bar mt-sm-5 p-2 pl-3 pr-3 m-2 rounded">
                <span class="status-indicator bg-primary flash animated infinite"></span>
                <span class="status-text pl-2">LIVE</span>
            </div>
        </div>
        <div class="video-wrap h-100  d-none" id="videobox"></div>
        <div class="video-loading d-flex justify-content-center align-items-center">
            <div class="spinner loading"></div>
        </div>
    </div>
`);

class RecorderView extends View {
    constructor() {
        super(VIEW_RECORDER, elem);
        
        const _videoEl = this.el.find(".video-wrap");
        const _loading = this.el.find(".video-loading");
        const _status = this.el.find(".status-text");
        const _bar = this.el.find(".recorder-bar");
        const _controlBar = new ControlBarComponent(this, ".control-placeholder", { stop: true });

        _videoEl.on("click", () => {
            _controlBar.showAnimated();
        });

        this.appendVideo = (tpl) => {
            $(tpl).appendTo(_videoEl);

            return this;
        };

        this.mute = () => {
            $("#thevideo").get(0).muted = "muted";

            return this;
        }

        this.unmute = () => {
            $("#thevideo").removeAttr("muted");

            return this;
        }

        this.controlBar = () => {
            return _controlBar;
        }

        this.loading = () => {
            
            _loading.removeClass("d-none").addClass("d-flex");
            _videoEl.addClass("d-none");
            _bar.removeClass("d-flex").addClass("d-none");
            _controlBar
            .showStop()
            .show()
            .hideButtons();

            return this;
        };

        this.show = () => {
            super.show();
            _videoEl.removeClass("d-none");
            _bar.removeClass("d-none").addClass("d-flex");
            _loading.addClass("d-none").removeClass("d-flex");
            
            _controlBar
            .showButtons()
            .showStop()
            .show()
            .hideAnimated()
            //_controlBar.social();
        }

    }
    
    
};

export default RecorderView;