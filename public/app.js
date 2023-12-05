let hAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
let vAxis = [8, 7, 6, 5, 4, 3, 2, 1];
const board = document.querySelector("#board");
const movesConatiner = document.querySelector("#movesContainer");


const fromWhite = [];
const toWhite = [];
const fromBlack = [];
const toBlack = [];
const whiteMovesList = [fromWhite, toWhite];
const blackMovesList = [fromBlack, toBlack];
const movesArr = [whiteMovesList, blackMovesList];

function updateMoves(fromPoolId, toPoolId) {
    if (fromWhite.length > fromBlack.length) {
        const newMove = document.createElement("div");
        newMove.setAttribute("class", "newMove");
        const p = document.createElement("p");
        p.innerText = `${fromWhite.length}.`;
        newMove.appendChild(p);
        movesConatiner.appendChild(newMove);
    }
    const newMoveArr = document.querySelectorAll(".newMove");
    const p = document.createElement("p");
    p.innerText = `${fromPoolId}` + ` - ` + `${toPoolId}`;
    newMoveArr[newMoveArr.length - 1].appendChild(p);
}

function isValid(imgId, fromPoolId, toPoolId) {
    if (fromPoolId == toPoolId) return false;
    if (imgId.charAt(1) == 'w') {
        if (fromWhite.length != fromBlack.length)
            return false;
    }
    else {
        if (fromWhite.length <= fromBlack.length)
            return false;
    }
    
    return true;
}

function dragStartEnd(img) {
    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.className = "grabbing";
        setTimeout(() => {
            e.target.className = "hide";
        }, 0)    
    });    
    img.addEventListener("dragend", (e) => {
        e.target.className = "pieces";
    });    
}    



function dragDrop(pool) {
    pool.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    pool.addEventListener("dragenter", (e) => {
        e.target.className += " hovering";
    });
    pool.addEventListener("dragleave", (e) => {
        e.target.className = "pool";
    });
    pool.addEventListener("drop", (e) => {
        e.target.className = "pool";
        let id1 = "#" + e.dataTransfer.getData('text/plain');
        let img = document.querySelector(id1);
        let id2 = "#" + e.target.id;
        let targetPool = document.querySelector(id2);

        // checking valid or not
        let fromPoolId = img.parentNode.id;
        let toPoolId = e.target.id;
        if (targetPool.nodeName != "DIV") {
            toPoolId = targetPool.parentNode.id;
        }
        if (!isValid(id1, fromPoolId, toPoolId)) return;


        if (targetPool.nodeName != "DIV") {
            let c = id2.charAt(2);
            if (c == 'p' || c == 'q' || c == 'r' || c == 'k' || c == 'b' || c == 'n')
                if (id1.charAt(1) == id2.charAt(1)) return;
            let targetPool1 = targetPool.parentNode;
            targetPool1.removeChild(targetPool);
            targetPool = targetPool1;
        }
        if (id1.charAt(1) == 'w') {
            fromWhite.push(fromPoolId);
            toWhite.push(toPoolId)
        }
        else {
            fromBlack.push(fromPoolId);
            toBlack.push(toPoolId)
        }
        updateMoves(fromPoolId, toPoolId);
        targetPool.appendChild(img);
    });
}

function addPieces(pool, i, j) {
    if (i > 1 && i < 6) return;
    let img = document.createElement("img"), id;
    if (i < 2) {
        if (i == 1) {
            img.src = "./images/bp.png";
            id = "bp" + j;
        }
        else if (j == 0 || j == 7) {
            img.src = "./images/br.png";
            id = "br" + j;
        }
        else if (j == 1 || j == 6) {
            img.src = "./images/bn.png";
            id = "bn" + j;
        }
        else if (j == 3) {
            img.src = "./images/bq.png";
            id = "bq" + j;
        }
        else if (j == 4) {
            img.src = "./images/bk.png";
            id = "bk";
        }
        else {
            img.src = "./images/bb.png";
            id = "bb" + j;
        }
    }
    if (i > 5) {
        if (i == 6) {
            img.src = "./images/wp.png";
            id = "wp" + j;
        }
        else if (j == 0 || j == 7) {
            img.src = "./images/wr.png";
            id = "wr" + j;
        }
        else if (j == 1 || j == 6) {
            img.src = "./images/wn.png";
            id = "wn" + j;
        }
        else if (j == 3) {
            img.src = "./images/wq.png";
            id = "wq";
        }
        else if (j == 4) {
            img.src = "./images/wk.png";
            id = "wk";
        }
        else {
            img.src = "./images/wb.png";
            id = "wb" + j;
        }
    }
    img.setAttribute("draggable", "true");
    img.setAttribute("class", "pieces");
    img.setAttribute("id", id);
    pool.appendChild(img);
    dragStartEnd(img);
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        let tempid = `${hAxis[j] + vAxis[i]}`;
        let pool = document.createElement("div");
        pool.setAttribute("class", tempid);
        let color;
        if ((i + j) % 2 == 0)
            color = "#edeed1";
        else
            color = "#779952";
        pool.style.backgroundColor = color;
        pool.setAttribute("class", "pool");
        pool.setAttribute("id", tempid);
        board.appendChild(pool);
        addPieces(pool, i, j);
        dragDrop(pool);
    }
}
