
import { $router } from '../router';
import { VIEW_ENDED, VIEW_MAIN } from '../views/view-names.js';

const $share = (elem, options) => {


    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } 
}





const jsSocialPopover = (targetElement, options) => {

    
    options = Object.assign({}, {
        placement: "bottom",
        trigger: 'focus',
        container: 'body',
        content: "<div class='popover-share-placeholder'>&nbsp;</div>",
        html: true
    }, options);

    $(targetElement).popover(options)        
     .on('shown.bs.popover', function (e,p) {
        const popoverElem = $($(this).data("bs.popover").tip);
        jsSocial(popoverElem.find(".popover-share-placeholder"));
    });

    
}

const jsSocial = (targetElem, url) => { 

    url = url || $router.view(VIEW_MAIN).uri();
    const streamName = $router.view("main").values().streamName;
    const text = `Join my live stream '${streamName}'`;
 
    $(targetElem).jsSocials("destroy");

    targetElem.jsSocials({
        shares: ["email", "twitter", "facebook", "linkedin","whatsapp"],
        url:  url,
        title: `Cloudinary Live Streaming`,
        text: `Join my live video broadcast: '${streamName}' @cloudinary live streaming`,
        shareIn: "blank",
        showCount: false,
        showLabel: false
    })
}

export { jsSocial, jsSocialPopover ,$share };