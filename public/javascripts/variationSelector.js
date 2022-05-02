import * as module from '../../routes/productDetail.js'

document.addEventListener('DOMContentLoaded', (e) => {

    const variants = document.querySelector('.variants');
    //variants.style.display = 'none';
    var colors = [];
    var sizes = [];
    var widths = [];

    function getVariationArray(theClass, newArray){
        const array = document.querySelectorAll(theClass);
        for(var i=0; i<array.length; i++){
            newArray[i] = array[i].textContent;
        }
        console.log(newArray);
    }

    getVariationArray('.colorName', colors);
    getVariationArray('.sizeName', sizes);
    getVariationArray('.widthName', widths);
    console.log(variantArray.module);
})