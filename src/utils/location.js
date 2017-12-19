import * as ENV from '../env';
import { transformation, transformationToQueryString } from './transformation';

const getParameterByName = (name) => {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const createObjFromURI = () => {
    var uri = decodeURI(location.search.substr(1));
    var chunks = uri.split('&');
    var params = Object();

    for (var i=0; i < chunks.length ; i++) {
        var chunk = chunks[i].split('=');
        if(chunk[0].search("\\[\\]") !== -1) {
            if( typeof params[chunk[0]] === 'undefined' ) {
                params[chunk[0]] = [chunk[1]];

            } else {
                params[chunk[0]].push(chunk[1]);
            }


        } else {
            params[chunk[0]] = chunk[1];
        }
    }

    return params;
}

const getVideoViewUri = (publicId, transformationHash) => {
    const url = window.location.href;
    const transformation = transformationToQueryString(transformationHash);    
    let params = [`view_id=${publicId}`];
    
    if(transformation != "")
        params.push(transformation);
    
    return url + "viewer.html?" + params.join("&");
}

const getVideoSrcUri = () => {
    const qs = createObjFromURI();
    let trans = transformation(qs);
    if(trans != "") 
        trans += "/";
    const videoUrl = `https://${ENV.CLD_API_HOST}/${ENV.CLOUD_NAME}/video/${ENV.UPLOAD_TYPE}/${trans}${qs.view_id}.m3u8z`;
    console.log("video src url");
    return videoUrl;
}


export { getParameterByName, createObjFromURI, getVideoViewUri, getVideoSrcUri };