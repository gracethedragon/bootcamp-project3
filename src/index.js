import axios from 'axios';
import 'regenerator-runtime/runtime';

import './styles.scss';

const holesArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
let opponentStore;
let playerStore;
let playerHolesArr;
let opponentHolesArr;
let filteredArr;
let lastHoleId;
let playerOne;
let playerTwo;
let nextPlayer;
let docCookies;
let playerTurn;
let nextPlayerCookie;
let gameEnd = false;

function setDefaultPlayers() {
  docCookies = document.cookie.split('; ').join('=').split('=');
  console.log(docCookies);
  const user = docCookies.indexOf('user');
  const curGameId = docCookies.indexOf('game');
  console.log(curGameId);
  document.getElementById('currentGameId').innerText = `Need to leave this game? ${docCookies[curGameId + 1]} is your game id.`;
  const playerOneName = docCookies.indexOf('playerOneName');
  const playerTwoName = docCookies.indexOf('playerTwoName');
  if (docCookies.indexOf('playerOneName') !== -1) {
    document.getElementById('playerOne').value = docCookies[playerOneName + 1];
    document.getElementById('playerTwo').value = docCookies[playerTwoName + 1];
  } else {
    document.getElementById('playerOne').value = docCookies[user + 1];
  }
  document.getElementById('currentGameId').value = docCookies[curGameId + 1];
  document.getElementById('announcement').innerText = `${document.getElementById('playerOne').value}, you go first!`;
}

// set active player board
function setPlayerHoles(player) {
  holesArr.forEach((hole) => {
    const element = document.getElementById(hole);
    element.classList.remove('active');
    const elementClone = element.cloneNode(true);
    element.parentNode.replaceChild(elementClone, element);
    console.log('removed');
  });

  if (player === playerOne) {
    opponentStore = 14;
    playerStore = 7;
    opponentHolesArr = [13, 12, 11, 10, 9, 8];
    playerHolesArr = [1, 2, 3, 4, 5, 6];
    nextPlayer = playerTwo;
  } else if (player === playerTwo) {
    opponentStore = 7;
    playerStore = 14;
    opponentHolesArr = [6, 5, 4, 3, 2, 1];
    playerHolesArr = [8, 9, 10, 11, 12, 13];
    nextPlayer = playerOne;
  }

  filteredArr = holesArr.filter((e) => e !== opponentStore);
  filteredArr.forEach((hole) => {
    document.getElementById(hole).style.backgroundColor = 'white';
  });
  console.log('player holes set', player);
  // document.getElementById('playername').innerText = player;

  setActiveHoles(playerHolesArr, player);
  document.cookie = `nextPlayer=${player}`;
  console.log(player, 'cookie');
  nextPlayerCookie = player;
}

function switchPlayer(player, nextPlayer) {
  console.log(player, nextPlayer, 'players');
  if (player === playerOne && nextPlayer === playerTwo) {
    console.log('curr player is 1, next is 2');
    player = playerTwo;
    nextPlayer = playerOne;
  } else if (player === playerTwo && nextPlayer === playerOne) {
    console.log('curr player is 2, next is 1');
    player = playerOne;
    nextPlayer = playerTwo;
  }
  nextPlayerCookie = player;
  console.log(nextPlayerCookie, 'nextPlayerCookie');
  setPlayerHoles(player);

  axios
    .get('/home')
    .then((response) => {
      console.log(response.data, nextPlayerCookie);
      const announcement = document.querySelector('#announcement').innerText;

      axios
        .put(`./gamedetails/${response.data.game}/${nextPlayerCookie}/${announcement}`)
        .then((response2) => console.log(response2.data, ' response2'));
    })
    .catch((error) => console.log(error));
}
// create marbles

function createMarbles(number, hole) {
  hole.style.fontSize = '0px';
  // const parentHole = document.getElementById(hole);

  if (number <= 10) {
    for (let i = 1; i <= number; i += 1) {
      const marble = document.createElement('span');
      marble.classList.add('sphere');
      hole.append(marble);
    }
  }
  else {
    console.log('too many marbles');
    hole.style.fontSize = '20px';
  }
}
// initialise game

const playButton = document.getElementById('playButton');
playButton.addEventListener('click', () => {
  console.log('clicked');

  if ((document.querySelector('#playerOne').value === '') || (document.querySelector('#playerTwo').value === '')) {
    alert('please enter player names');
  } else {
    document.getElementById('game-container').hidden = false;
    document.getElementById('record-players').hidden = true;
    document.getElementById('restart').hidden = false;
    document.getElementById('game-board').style.pointerEvents = 'auto';
    axios
      .post('/home', {
        playerOne: document.querySelector('#playerOne').value,
        playerTwo: document.querySelector('#playerTwo').value,
      })
      .then((response) => {
        setDefaultPlayers();
        console.log(response.data, 'response data');
        console.log([response.data.gamestate.game]);
        const playableHoles = Array.from(document.getElementsByClassName('hole'));
        playableHoles.sort((a, b) => a.id - b.id);
        playableHoles.forEach((playableHole, i) => {
          console.log(i, 'index');
          playableHole.innerText = response.data.gamestate.game[i];
          console.log(playableHole.innerText);
          createMarbles(Number(playableHole.innerText), playableHole);
        });
        playerOne = response.data.playerOneName;
        playerTwo = response.data.playerTwoName;
        // playerOne = response.
        document.getElementById('playerOneName').innerText = playerOne;
        document.getElementById('playerTwoName').innerText = playerTwo;
        setPlayerHoles(playerOne);

        console.log(playerHolesArr, 'playerholes');
      }).catch((error) => console.log(error));
  // eslint-disable-next-line no-use-before-define
  }
});

// move the marbles
function moveMarbles(element, player) {
  if (lastHoleId > 0) {
    document.getElementById(lastHoleId).style.backgroundColor = 'white';
  }
  document.querySelector('#announcement').innerText = '';

  console.log('filtered arr', filteredArr);
  // get number of marbles in cur hole
  const curMarbleNum = element.innerText;
  // set marbles in chosen hole to 0
  console.log('element', element);
  element.innerText = '';
  // position of element in filtered Arr (actual Num - 1)
  const position = filteredArr.indexOf(Number(element.id));
  console.log(position, 'position in filtered array');
  console.log(filteredArr, ' filtered array');
  // add marbles to subsequent holeslastHoleId
  console.log('checking');
  for (let i = 1; i <= curMarbleNum; i += 1) {
    let affectedArrPosition = position + i;
    if (affectedArrPosition >= 13) {
      affectedArrPosition -= 13;
    }
    const affectedHole = document.getElementById(filteredArr[affectedArrPosition]);
    console.log(affectedHole, 'affectedhole');
    const affectedHoleMarbleNum = affectedHole.innerText;
    affectedHole.innerText = Number(affectedHoleMarbleNum) + 1;
    createMarbles(Number(affectedHole.innerText), affectedHole);
    lastHoleId = Number(affectedHole.id);
    console.log(lastHoleId, 'affected position');
  }
  console.log(lastHoleId, 'last affected position');
  setTimeout(() => {
    document.getElementById(lastHoleId).style.backgroundColor = '#D2B48C';
  }, 10);
  checkPlayerTurn(player);
}

async function checkPlayerTurn(player) {
  console.log('checking turn', player);
  // not in player hole
  if (opponentHolesArr.includes(lastHoleId)) {
    document.querySelector('#announcement').innerText = `next player ${nextPlayer}`;
    console.log('check end game');
    playerTurn = nextPlayer;
    if (checkGameEnd(playerHolesArr, opponentHolesArr, player) !== true) {
      switchPlayer(player, nextPlayer);
    }
    console.log('player after switch', player);
  }
  // in player hole
  else {
    playerTurn = player;
    // check if it lands in the store
    // eslint-disable-next-line no-lonely-if
    if (playerStore === lastHoleId) {
      document.querySelector('#announcement').innerText = `${player} you landed in your own store, go again!`;
      checkGameEnd(playerHolesArr, opponentHolesArr, player);
    }
    // check whether marbles lands back in player's side
    else if (playerHolesArr.includes(lastHoleId)) {
      document.querySelector('#announcement').innerText = `${player} you landed in your home side`;
      // eslint-disable-next-line max-len
      const numMarbles = Number(document.getElementById(lastHoleId).innerText);
      // check if hole is empty; if not empty, move the marbles within
      if (numMarbles > 1) {
        document.querySelector('#announcement').innerText = `${player} you go again - auto play!`;
        console.log(document.querySelector('#announcement').innerText);
        setTimeout(() => {
          moveMarbles(document.getElementById(lastHoleId), player);
          console.log('went');
          console.log(document.querySelector('#announcement').innerText);
          // document.querySelector('#announcement').innerText = `player ${player} went again`;
        }, 1000);
      }
      // if hole is empty, check if opposite hole is empty
      else if (numMarbles === 1) {
        const oppHole = Number(opponentHolesArr[playerHolesArr.indexOf(lastHoleId)]);
        const numMarblesOppHoles = Number(document.getElementById(oppHole).innerText);
        console.log(numMarblesOppHoles, 'opphole');
        document.querySelector('#announcement').innerText = `checking opponent player ${nextPlayer} hole`;
        playerTurn = nextPlayer;
        if (numMarblesOppHoles > 0) {
          // eslint-disable-next-line max-len
          console.log('original store no.', Number(document.getElementById(playerStore).innerText));
          // eslint-disable-next-line max-len
          const newNumInPlayerStore = numMarblesOppHoles + Number(document.getElementById(playerStore).innerText);
          document.getElementById(playerStore).innerText = newNumInPlayerStore;
          document.getElementById(oppHole).innerText = '';
          createMarbles(newNumInPlayerStore, document.getElementById(playerStore));
          createMarbles(0, document.getElementById(oppHole));
          console.log('new store no.', Number(document.getElementById(playerStore).innerText));
          document.querySelector('#announcement').innerText = `${player} you got ${numMarblesOppHoles} of ${nextPlayer} marbles! ${nextPlayer} it's your turn`;
        } else {
          document.querySelector('#announcement').innerText = `next player: ${nextPlayer}`;
        }
        console.log('check end game');
        if (checkGameEnd(playerHolesArr, opponentHolesArr, player) === false) {
          switchPlayer(player, nextPlayer);
        }
      }
    }
  }
  console.log('next player is', playerTurn);
}

function checkGameEnd(playerHolesArr, opponentHolesArr, player) {
  // eslint-disable-next-line max-len
  const marblesInPlayerHoles = playerHolesArr.map((hole) => Number(document.getElementById(hole).innerText));
  // eslint-disable-next-line max-len
  const marblesInOppHoles = opponentHolesArr.map((hole) => Number(document.getElementById(hole).innerText));
  const numMarblesInPlayerHoles = marblesInPlayerHoles.reduce((a, b) => a + b);
  const numMarblesInOppHoles = marblesInOppHoles.reduce((a, b) => a + b);
  let marblesInOppStore = Number(document.getElementById(opponentStore).innerText);
  let marblesInPlayerStore = Number(document.getElementById(playerStore).innerText);
  let winner;
  let loser;
  let winningMarbles;
  const losingMarbles = 84 - winningMarbles;
  // check that game ends
  if (numMarblesInPlayerHoles === 0 || numMarblesInOppHoles === 0) {
    document.getElementById('game-board').style.pointerEvents = 'none';
    if (numMarblesInPlayerHoles === 0) {
      console.log('opponent store before', marblesInOppStore);
      marblesInOppStore += numMarblesInOppHoles;
      console.log('opponent store after', marblesInOppStore);
    } else if (numMarblesInOppHoles === 0) {
      console.log('player store before', marblesInOppStore);
      marblesInPlayerStore += numMarblesInPlayerHoles;
      console.log('player store after', marblesInOppStore);
    }

    if (marblesInOppStore > marblesInPlayerStore) {
      console.log('opponent wins');
      winner = nextPlayer;
      loser = player;
      winningMarbles = marblesInOppStore;
      document.querySelector('#announcement').innerText = `${nextPlayer} wins with ${winningMarbles}`;
    } else if (marblesInPlayerStore > marblesInOppStore) {
      winner = player;
      loser = nextPlayer;
      console.log('player wins');
      winningMarbles = marblesInPlayerStore;
      document.querySelector('#announcement').innerText = `${player} wins with ${winningMarbles}`;
      document.getElementById('restart').style.visibility = 'true';
    } else if (marblesInPlayerStore === marblesInOppStore) {
      console.log('draw!');
      winner = player;
      loser = nextPlayer;
      winningMarbles = marblesInOppStore;
      document.querySelector('#announcement').innerText = 'draw';
    }

    axios
      .get('/home')
      .then((response) => {
        axios
          .put(`./gameresults/${response.data.game}/${winner}/${winningMarbles}/${loser}/${losingMarbles}`)
          .then((response2) => {
            console.log(response2.data, ' response2');
          });
      })
      .catch((error) => console.log(error));
    const allActive = document.querySelectorAll('.active');
    allActive.forEach((active) => active.classList.remove('active'));
    gameEnd = true;
    return true;
  }
  return false;
}

function setActiveHoles(playerHolesArr, player) {
  console.log('set active');
  console.log(playerHolesArr);
  playerHolesArr.forEach((hole) => {
    document.getElementById(hole).classList.add('active');
    console.log('added', document.getElementById(hole));
    // eslint-disable-next-line prefer-arrow-callback
    document.getElementById(hole).addEventListener('click', () => {
      console.log('click', document.getElementById(hole));
      moveMarbles(document.getElementById(hole), player);

      const holes = Array.from(document.getElementsByClassName('hole'));
      holes.sort((a, b) => a.id - b.id);
      console.log(holes);
      const holeMarbleDetails = holes.map((marbles) => marbles.innerText);
      if (gameEnd === false) {
        axios
          .get('/home')
          .then((response) => {
            axios
              .put(`./gamedetails/${response.data.game}/${holeMarbleDetails}`)
              .then((response2) => {
                console.log('response sent');
                console.log(response2.data);
              });
          })
          .catch((error) => console.log(error));
      }
    });

  // }
  });
}

// retrieve game
const retrieveButton = document.getElementById('retrieveButton');

retrieveButton.addEventListener('click', () => {
  const id = document.querySelector('#retrieveGame').value;
  if (id === '') {
    console.log('clicked');
    alert('please enter a game id');
  } else {
    console.log(id);
    document.getElementById('record-players').hidden = true;
    console.log(id, 'id');
    axios
      .get(`/start/${id}`)
      .then((response) => {
        console.log(typeof (response.data.gamestate.winner));
        if (typeof (response.data.gamestate.winner) !== 'undefined') {
          console.log(response.data);
          document.getElementById('results').hidden = false;
          document.getElementById('winner').innerText = `${response.data.gamestate.winner} won against ${response.data.gamestate.loser} with ${response.data.gamestate.winningMarbles} marbles!`;
        } else {
          document.getElementById('game-container').hidden = false;
          document.getElementById('restart').hidden = false;
          console.log(response.data, 'response data');
          const gamestate = response.data.gamestate.game.split(',');
          const playableHoles = Array.from(document.getElementsByClassName('hole'));
          playableHoles.sort((a, b) => a.id - b.id);
          playableHoles.forEach((playableHole, i) => {
            console.log(i, 'index');
            playableHole.innerText = gamestate[i];
            console.log(playableHole.innerText);
            createMarbles(Number(playableHole.innerText), playableHole);
          });
          setDefaultPlayers();
          const playerOneName = docCookies.indexOf('playerOneName');
          const playerTwoName = docCookies.indexOf('playerTwoName');

          playerOne = docCookies[playerOneName + 1];
          playerTwo = docCookies[playerTwoName + 1];
          console.log(playerOne, playerTwo);
          document.getElementById('playerOneName').innerText = playerOne;
          document.getElementById('playerTwoName').innerText = playerTwo;
          document.getElementById('announcement').innerText = response.data.turn.announcement;
          playerOne = response.data.playerOneName;
          playerTwo = response.data.playerTwoName;
          setPlayerHoles(response.data.turn.turn);
          console.log(playerHolesArr, 'playerholes');
        }
      }).catch((error) => console.log(error));

  // eslint-disable-next-line no-use-before-define
  }
});

document.getElementById('homeButton').addEventListener('click', () => {
  console.log('clicked');
  document.getElementById('results').hidden = true;
  document.getElementById('record-players').hidden = false;
  document.querySelector('#retrieveGame').value = ''; });

document.getElementById('restart').addEventListener('click', () => {
  console.log('clicked');
  document.getElementById('restart').hidden = true;
  document.getElementById('results').hidden = true;
  document.getElementById('game-container').hidden = true;
  document.getElementById('record-players').hidden = false;
  document.querySelector('#retrieveGame').value = '';
  axios.get('/'); });
