
import Component from './component';


const elem = (options) => {

    const icon = options.localIcon ? `md-${options.icon}` : "material-icons";

    return $(`
        <div class="d-flex align-items-center">
            <div class="form-check">
                <label class="form-input-check form-check-label pl-0 d-flex align-items-center">
                    <input name="${options.name}" class="form-check-input" type="checkbox">
                    <span class="d-flex align-items-center pr-2">
                        <i class="material-icons md-18 checked text-secondary">check_box</i>
                        <i class="material-icons md-18 not-checked">check_box_outline_blank</i>
                    </span>
                    <i class="${icon} md-18">${options.icon}</i>
                    <span class="pl-2">${options.text}</span> 
                </label>
            </div>
        </div>
    `);
}

const defaults = {
    name: "",
    text: "",
    icon: "",
    checked: false,
    localIcon: false,
    isChecked: false,
}

class CheckboxComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {} ) {
        options = Object.assign({}, defaults, options);
        const _el = elem(options);
        const _checkbox = _el.find("[type=checkbox]");
        
        super(viewInstance, placeholderSelector, _el, options);            
        
        this.check = () => {_checkbox.prop("checked",true);
        this.uncheck = () => _checkbox.removeProp("checked") }
        this.val = (val) => {
            return _checkbox.val(val);       
        }
        
        this.checkbox = () => {
            return _checkbox;
        }

    }    

}




export default CheckboxComponent;


