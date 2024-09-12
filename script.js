// Wait until DOM is loaded, then render the game board.
window.addEventListener("DOMContentLoaded", function() {
    assembleHnefataflBoard();
});

let hnefataflPos = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
                    [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], 
                    [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55], 
                    [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66], 
                    [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], 
                    [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88], 
                    [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99], 
                    [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110], 
                    [111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121]];

// Be nice and declare all your variables at the top of the page.
var lastClicked = "";
var gameTurn = 0;
var denom = 8; // This is for tile color.
var list;

function clearSquares(){
    // THIS IS SO SLOW!
        for(var i = 0; i < document.getElementById("mainBoard").childElementCount; i++){
            document.getElementById("mainBoard").children[i].style.backgroundColor = parseInt((i / denom) + i) % 2 == 0 ? "green" : "beige";  
        }
}

// Move a given piece to a desired tile.
function movePiece(tile){
    if(document.getElementById(tile).style.background == "gold"){
        document.getElementById(tile).appendChild(document.getElementById(lastClicked));
        if (document.getElementById('hnefatafl').checked) captureHnefatafl();
        clearSquares();
        gameTurn++;
        console.log(gameTurn);
    }
}

function isSameHnefatafl(position){
    return position.children[0].classList[0].includes("defender") == document.getElementById(lastClicked).classList[0].includes("defender") || position.children[0].classList[0].includes("attacker") == document.getElementById(lastClicked).classList[0].includes("attacker");
}

/*
    Calculate and display valid moves for a given piece at a given tile.

    NOTE: Knight moves are in silver, cardinals/diags are in gold, and captures are in red.
*/
function validMoves(){
    if(document.getElementById('hnefatafl').checked && (document.getElementById(lastClicked).classList[0].includes("defender") && gameTurn % 2 == 0) || (document.getElementById(lastClicked).classList[0].includes("attacker") && gameTurn % 2 == 1)){ // If we're playing Hnefatafl...
        let curPos = document.getElementById(lastClicked).parentElement.id;
        let temp = findIndex(hnefataflPos, curPos);
        let unblocked = new Array(4).fill(true);
        // Find row by curPos.    
        let row = range(hnefataflPos[temp[0]][0], hnefataflPos[temp[0]][10]);
        
        for(i = 1; i <= 11; i++){
            let up = document.getElementById((curPos - 11 * i));
            let down = document.getElementById((parseInt(curPos) + 11 * i));
            let left = document.getElementById((curPos - i));
            let right = document.getElementById((parseInt(curPos) + i));
            
            if(!(up === null) && up.hasChildNodes()) unblocked[0] = false;
            if(!(down === null) && down.hasChildNodes()) unblocked[1] = false;
            if(!(left === null) && left.hasChildNodes()) unblocked[2] = false;
            if(!(right === null) && right.hasChildNodes()) unblocked[3] = false;

            // Only the king can be on the center tile.
            if(!lastClicked.includes("king")){
                if((curPos - 11 * i) == 61) unblocked[0] = false;   
                if((parseInt(curPos) + 11 * i) == 61) unblocked[1] = false;  
                if((curPos - i) == 61) unblocked[2] = false;  
                if((parseInt(curPos) + i) == 61) unblocked[3] = false;   
            }
            
            if(!(up === null) && unblocked[0]) !up.hasChildNodes() ? up.style.background = "gold" : {};
            if(!(down === null) && unblocked[1]) !down.hasChildNodes() ? down.style.background = "gold" : {};
            if(!(left === null) && unblocked[2] && row.includes(curPos - i)) !left.hasChildNodes() ? left.style.background = "gold" : {};
            if(!(right === null) && unblocked[3] && row.includes(parseInt(curPos) + i)) !right.hasChildNodes() ? right.style.background = "gold" : {};
        }
        
        unblocked.fill(true);
    }
}

// Find the column of a given array.
const arrayColumn = (arr, n) => arr.map(x => x[n]);
let captureKey = [true, false, true];


function captureHnefatafl(){
    let curPos = document.getElementById(lastClicked).parentElement.id;
    let temp = findIndex(hnefataflPos, curPos);
    // console.log(temp);

    let row = range(hnefataflPos[temp[0]][0], hnefataflPos[temp[0]][10]);
    let col = arrayColumn(hnefataflPos, temp[1]);
    // console.log(col);

    let captureUp = new Array(3).fill(false);
    let captureDown = new Array(3).fill(false);
    let captureLeft = new Array(3).fill(false);
    let captureRight = new Array(3).fill(false);

    for(let i = 0; i <= 2; i++){
        let up = document.getElementById((curPos - 11 * i));
        let down = document.getElementById((parseInt(curPos) + 11 * i));
        let left = document.getElementById((curPos - i));
        let right = document.getElementById((parseInt(curPos) + i));

        if(!(up === null) && up.hasChildNodes()) captureUp[i] = isSameHnefatafl(up);
        if(!(down === null) && down.hasChildNodes()) captureDown[i] = isSameHnefatafl(down);
        if(!(left === null) && left.hasChildNodes()) captureLeft[i] = isSameHnefatafl(left);
        if(!(right === null) && right.hasChildNodes()) captureRight[i] = isSameHnefatafl(right);
        
        let middle = document.getElementById((curPos - 11));
        if (captureUp.toString() === captureKey.toString() && i == 2 && middle.hasChildNodes()){
            middle.removeChild(middle.firstChild);
        }
        
        middle = document.getElementById((parseInt(curPos) + 11));
        if (captureDown.toString() === captureKey.toString() && i == 2 && middle.hasChildNodes()){  
            middle.removeChild(middle.firstChild);
        }
        
        middle = document.getElementById((curPos - 1));
        if (captureLeft.toString() === captureKey.toString() && i == 2 && middle.hasChildNodes()){
            middle.removeChild(middle.firstChild);
        }
        
        middle = document.getElementById((parseInt(curPos) + 1));
        if (captureRight.toString() === captureKey.toString() && i == 2 && middle.hasChildNodes()){    
            middle.removeChild(middle.firstChild);
        }
    }

    checkVictory();
}

function checkVictory(){
    // Check to see if the king was captured.
    const myNode = document.getElementById("mainBoard");
    let noKing = true;
    let kingEscaped = false;

    for(var i = 0; i < document.getElementById("mainBoard").childElementCount; i++){
        if(Array.from(document.getElementById("mainBoard").children[i].children).includes(document.getElementById("king"))) noKing = false; 
    }
    
    // Find position of king and see if he's in one of the corners.
    if(!(document.getElementById("king") === null)){
        if(document.getElementById("1").hasChildNodes() && document.getElementById("1").children[0].id.toString() == "king") kingEscaped = true;
        if(document.getElementById("11").hasChildNodes() && document.getElementById("11").children[0].id.toString() == "king") kingEscaped = true;
        if(document.getElementById("111").hasChildNodes() && document.getElementById("111").children[0].id.toString() == "king" ) kingEscaped = true;
        if(document.getElementById("121").hasChildNodes() && document.getElementById("121").children[0].id.toString() == "king") kingEscaped = true;
    }
     
    // range(111, 121).includes(parseInt(document.getElementById("king").parentElement.id))
    // arrayColumn(hnefataflPos, 0).includes(parseInt(document.getElementById("king").parentElement.id))
    // arrayColumn(hnefataflPos, 10).includes(parseInt(document.getElementById("king").parentElement.id))
    // (range(1, 11).includes(parseInt(document.getElementById("king").parentElement.id))
    
    if(noKing){
        alert("Attackers win!");
    }
    else if(kingEscaped){
        alert("Defenders win!");
    }
}

function findIndex(stringArr,keyString)
{
    // Initialising result array to -1
    // in case keyString is not found
    let result = [ -1, -1 ];
 
    // Iteration over all the elements
    // of the 2-D array
 
    // Rows
    for (let i = 0; i < stringArr.length; i++) {
 
        // Columns
        for (let j = 0; j < stringArr[i].length; j++) {
 
            // If keyString is found
            if (stringArr[i][j] == keyString) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
 
    // If keyString is not found
    // then -1 is returned
    return result;
}

function range(start, end) {
    if(start === end) return [start];
    return [start, ...range(start + 1, end)];
}

// Put listeners on each of the pieces dynamically.
function pieceHelper(piece){
        piece.addEventListener("click", myFunc = function () {
            clearSquares();
            console.log(piece.id);
            lastClicked = piece.id;
            validMoves();
        });
}

// BUILD THE BOARD!
function assembleHnefataflBoard(){
    denom = 121;
    gameTurn = 0;
    let j = 0;

    document.getElementById("mainBoard").style['width'] = "660px";
    document.getElementById("mainBoard").style['height'] = "660px";

    for (var i = 0; i < 121; i++){
        let tile = document.getElementById("mainBoard").appendChild(document.createElement("div"));
        tile.style.backgroundColor = parseInt((i / denom) + i) % 2 == 0 ? "green" : "beige";  
        tile.addEventListener("click", function () {
            console.log("tile " + tile.id);
            movePiece(tile.id);
        });
        tile.setAttribute("id", i + 1);
        tile.setAttribute("class", "tile");        
    }

    // Place down circles for attackers.
    for(i = 119; i >= 105; i--){
        if(!(i <= 112 && i >= 106)){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "attacker");
            circle.setAttribute("id", 1 + " attacker " + j);
            j++;    
        }
    }
    j = 0;

    for(i = 17; i >= 3; i--){
        if(!(i < 17 && i >= 10)){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "attacker");
            circle.setAttribute("id", 2 + " attacker " + j);
            j++;    
        }
    }
    j = 0;

    for(i = 89; i >= 23; i--){
        if((i % 11 == 1) || i == 57){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "attacker");
            circle.setAttribute("id", 3 + " attacker " + j);
            j++;    
        }   
    }
    j = 0;

    for(i = 99; i >= 33; i--){
        if((i % 11 == 0) || i == 65){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "attacker");
            circle.setAttribute("id", 4 + " attacker " + j);
            j++;    
        }   
    }
    j = 0;

    // Place down circles for defenders.
    for(i = 83; i >= 39; i--){
        if((((i % 11 == 7) || (i % 11 == 6) || (i % 11 == 5)) && ((i != 61) && (i != 40) && (i != 82))) || (i == 63) || (i == 59)){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "defender");
            circle.setAttribute("id", "defender " + j);
            j++;    
        }
        else if(i == 61){
            let circle = document.getElementById(i).appendChild(document.createElement("div"));
            circle.setAttribute("class", "defender-king");
            circle.setAttribute("id", "king");   
        }
    }
    j = 0;

    list = [...document.getElementsByTagName("div")];

    list.forEach(element => { 
        if (!(element.classList[0] === undefined)) element.classList[0].includes("defender") || element.classList[0].includes("attacker") ? pieceHelper(element) : {};
    });
}