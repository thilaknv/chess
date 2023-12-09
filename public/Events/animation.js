

function moveTo(srcId, dstId) {
    return {
        x: dstId.charCodeAt(0) - srcId.charCodeAt(0),
        y: srcId.charCodeAt(1) - dstId.charCodeAt(1)
    };
}

function addAnimation(piece, srcId, dstId, unit) {
    const moveToObj = moveTo(srcId, dstId);
    piece.style.transform = `translate(${unit * moveToObj.x}px, ${unit * moveToObj.y}px)`;
}
function removeAnimation(piece) {
    piece.style.transform = "none";
}

export {
    addAnimation, removeAnimation
}