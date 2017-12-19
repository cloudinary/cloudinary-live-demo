
const TRANSFORMATIONS = {
    //"opener": () => ``,
    "blur": () => 'e_blur',    
    "logo": ( logo ) => `l_${logo},w_100,g_north_west,x_10,y_10`,
    "vignette": () => 'e_vignette:60'
};


// transformation = [
//     {
//         effect: "blur"
//     },
//     {
//         effect: "vignette:80"
//     },
//     {
//         overlay: "publicid",
//         x: 10,
//         y:10,
//         gravity: "north_west",
//         width: 50,
//     }
// ]



const TRANSFORMATIONS_QUERY_STRING = {
    "opener": () => true,
    "blur": () => true,    
    "logo": ( logo ) => `${logo}`,
    "vignette": () => true
};

const transformationRaw = (transHash = {}) => {
    let trans = ["x_0"];
    
    $.each(transHash, function( name, value) {
        if(TRANSFORMATIONS[name]) { 
            trans.push(TRANSFORMATIONS[name](value));
        }
    }) 
        
    return trans.join("/");
}

const transformationToQueryString = (transHash = {}) => {
    let trans = [];
    
    $.each(transHash, function( name, value) {
        if(TRANSFORMATIONS[name]) { 
            trans.push(name+"=" + TRANSFORMATIONS_QUERY_STRING[name](value));
        }
    })
              
    return trans.join("&");
}

export { transformationRaw, transformationToQueryString };