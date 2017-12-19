
import Component from './component';

const elem = (options) => {
    const icon = options.localIcon ? `md-${options.icon}` : "material-icons";
    const iconName = options.localIcon ? "" : options.icon;
    const iconTpl = options.icon  ? `<i class="${icon} md-18 md-icon-bg">${iconName}</i>` : "";

    return $(`
        <div class="d-flex align-items-center mb-4">
            <div class="form-check">
            <label class="form-input-radio form-radio-label pl-0 d-flex align-items-center">
                <input value="${options.value}" name="${options.name}" class="form-radio-input" type="radio" 
                    data-panel-show-ref="${ options.panelShowRef }" 
                    data-panel-hide-ref="${ options.panelHideRef }">
                <span class="d-flex align-items-center pr-2">
                    <i class="material-icons md-18 checked text-secondary">radio_button_checked</i>
                    <i class="material-icons md-18 not-checked">radio_button_unchecked</i>
                </span>
                ${iconTpl}
                <span class="pl-2">${options.text}</span> 
            </label>
            </div>
        </div>
    `)
};

const defaults = {
    name: "",
    text: "",
    icon: false,
    value: "",
    localIcon: false,
    isChecked: false,
    panelShowRef : [""],
    panelHideRef : "",
    on: {
        change: $.noop
    }
}


class RadioComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {} ) {
        options = Object.assign({}, defaults, options);
        const _el = elem(options);
        const _radio = _el.find("input[type=radio]")
        
        super(viewInstance, placeholderSelector, _el, options);
        
        this.check = () => {
            _radio.prop("checked",true);
            options.on.change.call(this, _radio);   
        };
        this.uncheck = () => {
            _radio.removeProp("checked");
            options.on.change.call(this, _radio);
        }
        this.val = (val) => {
            return _radio.val(val);       
        }

        if(options.on.change) {
            _radio.on("change",options.on.change);
        }
    }    
}

export default RadioComponent;


