window.addEventListener("DOMContentLoaded", function() {
    populateDeck();
    console.log(cards);
});

let suits = ['c', 'd', 'h', 's'];
let cards = []; // Treat this like a stack; only push and pop.

/* Randomize deck in-place using Durstenfeld shuffle algorithm */
function shuffleDeck(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Do what it says on the tin.
function splitDeck(array){
    console.log([array.slice(0, array.length / 2), array.slice((array.length / 2))]);
    return [array.slice(0, array.length / 2), array.slice(0, array.length / 2)];
}

function populateDeck(){
    for(let j = 0; j < 4; j++){
        for (let i = 1; i <= 13; i++){
            switch(i){ // For unique valued cards
                case 1:
                    cards.push('a' + suits[j]);
                    break;
                case 11:
                    cards.push('j' + suits[j]);
                    break;
                case 12:
                    cards.push('q' + suits[j]);
                    break;
                case 13:
                    cards.push('k' + suits[j]);
                    break;
                default:
                    cards.push(i + suits[j]);
            }
        }
    }

    shuffleDeck(cards);
}

function drawCard(player){
    if (cards.length == 0){
        console.log("There's nothing else!");
    }
    else{
        let card = document.getElementById(player).appendChild(document.createElement("span"));
        let cardName = "pcard-" + cards.pop(); // Take from top of the deck, like a real deck of cards.
        
        console.log(cardName);
        card.setAttribute("class", cardName);
    }
}

// Maw or Spoil Five

function determineDealer(){
    let iter = 0;
    
    while(!/j./.test(cards[cards.length - 1])){
        drawCard("player-" + ((iter % 2) + 1));
        iter += 1;
    };
    
    drawCard("player-" + ((iter % 2) + 1)); // Show the Jack!
}