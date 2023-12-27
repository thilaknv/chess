import { fliped } from "../app.js";


function moveTo(srcId, dstId) {
    return {
        x: dstId.charCodeAt(0) - srcId.charCodeAt(0),
        y: srcId.charCodeAt(1) - dstId.charCodeAt(1)
    };
}

function addAnimation(piece, srcId, dstId, unit) {
    const moveToObj = moveTo(srcId, dstId);
    if (fliped) {
        moveToObj.y = -moveToObj.y;
    }
    piece.style.transform = `translate(${unit * moveToObj.x}px, ${unit * moveToObj.y}px)`;
    piece.style.zIndex = '2';

}
function removeAnimation(piece) {
    piece.style.transform = "none";
    piece.style.zIndex = '1';
}

export {
    addAnimation, removeAnimation
}