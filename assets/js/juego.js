let deck                    = [];
let playerPoints            = 0,
    botPoints               = 0;
const types                 = ['C','D','H','S'];
const specials              = ['A','J','Q','K'];
const btnTakePlayingCard    = document.querySelector('#btn-take-playing-card');
const btnStopGame           = document.querySelector('#btn-stop-game');
const btnNewGame            = document.querySelector('#btn-new-game');
const pointsHTML            = document.querySelectorAll('small');
const divPlayerPlayingCards = document.querySelector('#playing-cards-player');
const divBotPlayingCards    = document.querySelector('#playing-cards-bot');

/**
 * Función que permite crear un mazo de juego por cada partida
 * @returns Array
 */
const createDeck = () => {
    deck = [];
    for(let i = 2; i <= 10; i++){
        for(let type of types){
            deck.push(`${i+type}`)
        }
    }

    for(let type of types){
        for(let special of specials){
            deck.push(`${special+type}`)
        }
    }

    return _.shuffle(_.shuffle(_.shuffle(deck)));
};

deck = createDeck();

/**
 * Función que permite obtener una carta
 * @returns String
 */
const takePlayingCard = () => {
    if(deck.length === 0) throw '¡No hay más cartas en el mazo!';
    return deck.pop();
}

/**
 * Función para obtener el valor de la carta
 * @param string card 
 * @returns int
 */
const playingCardValue = (playingCard) => {
    let value = playingCard.substring(0, playingCard.length - 1);    
    return (isNaN(value) ? ((value === 'A') ? 11 : 10) : value * 1);
}

/**
 * Función para generar la carta y hacer la sumatoria de puntos
 * @param int isPlayer: 0 = jugador, 1 = computadora
 * @returns null
 */
const generatePlayingCard = (isPlayer) => {
    const playingCard = takePlayingCard();
        
    const imgPlayingCard = document.createElement('img');
    imgPlayingCard.src = `assets/cartas/${playingCard}.png`;
    imgPlayingCard.className = 'playing-card';
    
    if(isPlayer === 0){
        playerPoints += playingCardValue(playingCard);
        pointsHTML[isPlayer].innerText = playerPoints;
        divPlayerPlayingCards.append(imgPlayingCard);
    }else{
        botPoints += playingCardValue(playingCard);
        pointsHTML[isPlayer].innerText = botPoints;
        divBotPlayingCards.append(imgPlayingCard);
    }
}

/**
 * Función del bot para que agarre cartas
 * @param int minPoints 
 * @returns null
 */
const botTurn = (minPoints) => {
    do{
        generatePlayingCard(1);

        if(minPoints > 21) break;
    }while((botPoints < minPoints) && (minPoints <= 21));

    setTimeout(() => {
        showWinner();
    },100)
}

/**
 * Función para inhabilitar las acciones del jugador
 * @param string text
 * @returns null 
 */
const stopPlayerTurn = () => {
    btnTakePlayingCard.disabled = true;
    btnStopGame.disabled = true;
    botTurn(playerPoints);
}

const showWinner = () => {
    if(botPoints === 21){
        alert('Has perdido :(, ¡intenta nuevamente!');
    }else if(playerPoints == botPoints){
        alert('¡Ha habido un empate o.o!');
    }else if(playerPoints < botPoints){
        alert('¡Felicidades, has ganado :D!');

    }else{
        alert('Has perdido :(, ¡intenta nuevamente!');
    }
}

//Events
btnTakePlayingCard.addEventListener('click',() => {
    generatePlayingCard(0);

    if(playerPoints > 21){
        stopPlayerTurn();
    }else if(playerPoints === 21){
        stopPlayerTurn();
    }
});

btnStopGame.addEventListener('click',() => {
    stopPlayerTurn();
});

btnNewGame.addEventListener('click',() => {
    deck                            = createDeck();
    divPlayerPlayingCards.innerHTML = '';
    divBotPlayingCards.innerHTML    = '';
    playerPoints                    = 0;
    botPoints                       = 0;
    pointsHTML[0].innerText         = 0;
    pointsHTML[1].innerText         = 0;
    btnStopGame.disabled            = false;
    btnTakePlayingCard.disabled     = false;
})