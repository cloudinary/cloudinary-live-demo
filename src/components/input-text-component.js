

import Component from './component';

const elem = (options) => {
    const readonly = options.readonly ? "readonly" : "";

    return $(`
        <div class="pt-2">
            <label>${options.label}</label>
            <input id="${options.id}" name="${options.name}" 
                   class="input-field border-primary text-primary" 
                   type="text" 
                   placeholder="${options.placeholder}" 
                   value="${options.value}"
                   ${readonly}/>
        </div>
    `)
};

const defaults = {
    name: "",
    label: "",
    placeholder: "",
    value: "",
    id: "",
    readonly: false
}

class InputTextComponent extends Component {
    constructor(viewInstance, placeholderSelector, options) {
        options = Object.assign({}, defaults, options);
        const _el = elem(options);
        const _input = _el.find("input");

        super(viewInstance, placeholderSelector, _el);       
        
        this.val = (value) => { 
            _input.val(value) 

            return this;
        };

        this.input = () => { 
            return _input;
        }
    }    
}

export default InputTextComponent;