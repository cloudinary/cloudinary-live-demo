
import Component from './component';

const elem = (options) => {
    const cls = options.alwaysShow ? '' : 'd-none d-sm-flex'; 
    return $(`
    <nav class="navbar align-items-center justify-content-center position-fixed w-100 pb-0 pt-0 ${cls} bg-opacity text-light">
        <span class="d-flex align-items-center navbar-brand font-weight-light" href="#">
            <span class="header-logo cld-logo-white d-inline-block mr-4"></span>
            <span>Cloudinary Live Streaming <sup style="font-size: 0.7rem;">Beta</sup></span>
        </span>
    </nav>`)
};

class NavbarComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {}) {
        super(viewInstance, placeholderSelector, elem(options));            
    }    
}

export default NavbarComponent;

// <button class="btn btn-light navbar-text d-flex flex-row align-items-center pl-2 pr-2">
            //     <i class="material-icons md-18 pr-2">mic_off</i>
            //     <span>Mute</span>
            // </button>

        //     <button class="btn btn-light navbar-text d-flex flex-row align-items-center pl-2 pr-2">
        //     <i class="material-icons md-18 pr-2">share</i> Share
        // </button>