function getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
            elem = elem.offsetParent;
        }
    } while (elem.offsetParent);
    return offsetLeft;
}

function getOffsetTop(elem) {
    let offsetTop = 0;
    do {
        if (!isNaN(elem.offsetTop)) {
            offsetTop += elem.offsetTop;
            elem = elem.offsetParent;
        }
    } while (elem.offsetParent);
    return offsetTop;
}

export {
    getOffsetLeft, getOffsetTop
}