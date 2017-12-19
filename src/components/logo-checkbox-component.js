
import Component from './component';
import CheckboxComponent from './checkbox-component';
import * as ENV from '../env';


const elem = (options) => {
    return $(`
        <div class="d-flex position-relative align-items-center justify-content-betweenn">
            <div class="logo-placeholder"></div>
            <div class="position-absolute" style="right: 0; top: 0;">
                <button id="upload_widget_opener" class="upload-button btn btn-white d-none" >UPLOAD</button>  
                <div class="position-relative justify-content-center align-items-center d-none" id="upload_widget_thumb-placeholder">
                    <i class="material-icons md-12 mr-2">attach_file</i>
                    <div class="p-4 img-placeholder"></div>
                    <button class="btn-remove-logo position-absolute btn btn-icon btn-transparent"><i class="material-icons md-12">close</i></button>
                </div>
            </div>
         </div>
    `);
}

class LogoCheckboxComponent extends Component {
    constructor(viewInstance, placeholderSelector, options = {}) {
        const _el = elem(options);
        const _checkbox = new CheckboxComponent(_el, ".logo-placeholder", { text: options.text, name: "logo", icon: "cloud_upload"});
        const _uploadButton = _el.find(".upload-button");
        super(viewInstance, placeholderSelector, _el);            
        
        this.check = () => { 
            _checkbox.check();
            _uploadButton.removeClass("d-none"); 
            return this; 
        };
        
        this.uncheck = () => { 
            _checkbox.uncheck(); 
            _checkbox.val(""); 
            _uploadButton.addClass("d-none");
            $("#upload_widget_thumb-placeholder").removeClass("d-flex").addClass("d-none");  
            return this; 
        }

        _checkbox.checkbox().on("change", (e) => {
            if(e.target.checked) {
                this.check();
            } else {
                this.uncheck();
            }
        }); 

        $(".btn-remove-logo").click( () => {
            _checkbox.val();
            _uploadButton.removeClass("d-none");
            $("#upload_widget_thumb-placeholder").removeClass("d-flex").addClass("d-none");  
        })
        // Init Cloudinary Upload Widget

    
        _uploadButton.on("click touch", function() {
            cloudinary.openUploadWidget({ 
                cloud_name: ENV.CLOUD_NAME_IMAGES, 
                upload_preset: ENV.UPLOAD_PRESET_IMAGES
                //upload_prefix: ENV.UPLOAD_WIDGET_PREFIX,
                //secure_distribution: ENV.CLD_RES_HOST
            }, 
              function(error, result) { 
                 
                  if(result.length > 0) {

                    const logo = result[0].thumbnail_url;
                    _checkbox.val(result[0].public_id);

                    $("#upload_widget_thumb-placeholder").removeClass("d-none").addClass("d-flex");
                    $("#upload_widget_thumb-placeholder .img-placeholder").html(`<img src='${logo}'/>`);
                    _uploadButton.addClass("d-none");
                  }
               });
        });

    }    

}




export default LogoCheckboxComponent;


