const blackjackModule = (() => {
    'use strict';

    let deck                   = [],
        playersPoints          = [],
        numParticipants        = document.getElementById('num-players').value,
        pointsHTML             = document.querySelectorAll('small'),
        divPlayingCards        = document.querySelectorAll('.playing-cards'),
        stopGame               = false
    const types                = ['C','D','H','S'],
          specials             = ['A','J','Q','K'],
          btnTakePlayingCard   = document.querySelector('#btn-take-playing-card'),
          btnStopGame          = document.querySelector('#btn-stop-game'),
          btnContinueGame      = document.querySelector('#btn-continue-game'),
          btnNewGame           = document.querySelector('#btn-new-game'),
          numPlayersInput      = document.getElementById('num-players');

    /**
     * Función para iniciar el juego / Function to start the game
     * @param int numPlayers
     * @returns void
     */
    const startGame = (numPlayers = 2) => {
        deck                        = createDeck();
        playersPoints               = [];
        btnTakePlayingCard.disabled = false;
        btnStopGame.disabled        = false;
        stopGame                    = false;

        for( let i = 0; i< numPlayers; i++ ) {
            playersPoints.push(0);
        }
        pointsHTML.forEach(elem => elem.innerText = 0);
        divPlayingCards.forEach( elem => elem.innerHTML = '');

        const cpuPlayersContainer = document.getElementById('cpu-players-container');
        cpuPlayersContainer.innerHTML = '';
        for (let i = 1; i < numPlayers; i++) {
            const cpuPlayerDiv = document.createElement('div');
            cpuPlayerDiv.classList.add('box');
            cpuPlayerDiv.innerHTML = `
                <p>CPU ${i} - <small>0</small></p>
                <div class="playing-cards">
                </div>
            `;
            cpuPlayersContainer.appendChild(cpuPlayerDiv);
        }
        pointsHTML = document.querySelectorAll('small');
        divPlayingCards = document.querySelectorAll('.playing-cards')
    }

    /**
     * Función para inhabilitar las acciones del jugador / Function to disable player actions
     * @param int playerPoints
     * @returns null 
     */
    const stopPlayerTurn = (playerPoints) => {
        btnTakePlayingCard.disabled = true;
        btnStopGame.disabled = true;
        btnContinueGame.disabled = true;
        cpuTurn(playerPoints);
    }    

    /**
     * Función del bot para que agarre cartas / Bot function to grab cards
     * @param int minPoints 
     * @returns null
     */
    const cpuTurn = (minPoints) => {
        for (let i = 1; i < playersPoints.length; i++) {
            if(playersPoints[i] > 21){
                continue;
            }
            let cpuPoints = 0;

            do {
                const playingCard = takePlayingCard();
                cpuPoints = accumulatePoints(playingCard, i);
                makePlayingCard(playingCard, i);
            } while ((cpuPoints < minPoints) && (minPoints <= 21) && stopGame);

        }
        if(stopGame || playersPoints[0] > 21){
            showWinner();
        }else{
            btnTakePlayingCard.disabled = false;
            btnStopGame.disabled        = false;
            btnContinueGame.disabled    = true;
        }
    }

    /**
     * Función para obtener el valor de la carta / Function to obtain the value of the card
     * @param string card 
     * @returns int
     */
    const playingCardValue = (playingCard) => {
        let value = playingCard.substring(0, playingCard.length - 1);    
        return (isNaN(value) ? ((value === 'A') ? 11 : 10) : value * 1);
    }

    /**
     * Función para generar la carta y hacer la sumatoria de puntos / Function to generate the letter and add the points
     * @param string playingCard
     * @param int turn: 0 = jugador/player, el resto de números son los demás jugadores / the rest of the numbers are the other players
     * @returns int
     */
    const accumulatePoints = (playingCard, turn) => {
        playersPoints[turn] += playingCardValue(playingCard);
        pointsHTML[turn].innerText = playersPoints[turn];
        return playersPoints[turn];
    }

    /**
     * Función para crear la imagen de la carta seleccionada / Function to create the image of the selected card
     * @param string playingCard 
     * @param int turn 
     * @returns void
     */
    const makePlayingCard = (playingCard, turn) => {
        const imgPlayingCard = document.createElement('img');
        imgPlayingCard.src = `assets/cartas/${playingCard}.png`;
        imgPlayingCard.alt = `Carta ${playingCard}`;
        divPlayingCards[turn].append(imgPlayingCard);
    }

    /**
     * Función para mostrar quien ganó / Function to show who won
     * @returns void
     */
    const showWinner = () => {
        const [playerPoints, ...cpuPoints] = playersPoints;

        setTimeout(() => {
            if (playerPoints > 21) {
                alert('Has perdido :(, ¡intenta nuevamente!');
            } else {                
                let winningCpuPoints = cpuPoints.filter(points => points <= 21 && points > playerPoints);
                let winningCpuPoint = Math.max(...winningCpuPoints, 0);
                if (winningCpuPoint > 0) {
                    alert('Has perdido :(, ¡intenta nuevamente!');
                } else {
                    let cpuEqualPlayer = cpuPoints.some(points => points === playerPoints);
                    if(cpuEqualPlayer){
                        alert('¡Ha habido un empate! o.o');
                    }else{
                        alert('¡Felicidades, has ganado :D!');
                    }
                }
            }
        }, 750);
    }

    /**
     * Función que permite crear un mazo de juego por cada partida / Function that allows you to create a game deck for each game
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

    /**
     * Función que permite obtener una carta / Function that allows you to obtain a letter
     * @returns String
     */
    const takePlayingCard = () => {
        if(deck.length === 0) throw '¡No hay más cartas en el mazo!';
        return deck.pop();
    }

    //Eventos / Events
    btnTakePlayingCard.addEventListener('click',() => {
        const playingCard = takePlayingCard();
        const playerPoints = accumulatePoints(playingCard, 0);        
        makePlayingCard(playingCard, 0);

        if (playerPoints > 21) stopPlayerTurn(playerPoints);

        btnTakePlayingCard.disabled = true;
        btnContinueGame.disabled    = false;
    });

    btnContinueGame.addEventListener('click',() => {
        if(playersPoints[0] > 0){
            stopPlayerTurn(playersPoints[0]);
        }else{
            alert('Debes agarrar una carta o detener el juego.')
        }
    });

    btnStopGame.addEventListener('click',() => {
        stopGame = true;
        stopPlayerTurn(playersPoints[0]);
    });

    btnNewGame.addEventListener('click',() => {
        numParticipants = document.getElementById('num-players').value;
        startGame(numParticipants);
    })

    numPlayersInput.addEventListener('input', () => {
        const value = numPlayersInput.value;
        const isValid = /^(?:[2-7]|)$/.test(value);
        numPlayersInput.value = (isValid || value === '' ? value : '');
    });

    return {
        startGame,
    }
})();