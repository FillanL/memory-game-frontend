// ********// ***************************************
// declare constants needed
// ***************************************
const gameContainer = document.querySelector('#game-container')
const hiScoreBtn = document.querySelector('#hi-score-btn')
const hiScoreTbl = document.querySelector('#hi-score-table')
const newUserForm = document.querySelector('#create-username')
const scoresBody = document.querySelector('#hi-score-body')
const newUser = document.querySelector('#user')
const userDifficultySelect = document.querySelector('#user-diffculty')
const currentPlayer = document.querySelector('#current-player')
const logOutBtn = document.querySelector('#log-out-btn')
const startGameBtn = document.querySelector('#game-start-btn')
const gameScore = document.querySelector('#game-score')
const restartGameBtn = document.querySelector('#game-restart-btn')
const playInfo = document.querySelector('#how-to-play')
const playArt = document.querySelector('#how-to-article')
const gameCover = document.querySelector('#game-cover')

// const myStatsBtn = document.querySelector('#my-stats-btn')

let gameActive = false;
let allowKeyPress = false;
let loggedInUser;
let keySequenceArray = [];
let currentScore = 0
let usersDifficulty;

let randomNumber
let currentPlayerId;
let time = document.getElementById('time')
let seconds
let minutes = 0;
let numOfCards
let correctLines = 1;
let delaySeconds;
let consecIndex = 0

// let t;
// *****************************************
// end of delcaration
// ******************************************
// Start of all declared function that will be called
// *****************************************

let postGameScore = () => {
    fetch('https://whichwayyy.herokuapp.com/api/v1/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            difficulty: difficulty,
            user_id: currentPlayerId,
            score: currentScore
        })
    })
}


//changes delaySeconds and starting cards based on user input
function gameSettings() {
    switch (difficulty) {
        case "Easy":
            numOfCards = 2
            delaySeconds = 3000
            break;

        case "Intermediate":
            numOfCards = 2
            delaySeconds = 2500
            break;

        case "Hard":
            numOfCards = 3
            delaySeconds = 2000
            break;

        default:
            numOfCards = 2
            delaySeconds = 2000
            break;

    }
}

function subtract() {
    // seconds--;
    if (seconds > 0) {
        seconds--;
        // return

        time.innerHTML = (seconds > 9 ? seconds : "0" + seconds);
        timer();
    } else if (seconds === 0) {
        allowKeyPress = false
        gameActive = false
        time.innerHTML = ""
        time.innerText = "Game Over"
        postGameScore();
    }
}

function timer() {
    t = setTimeout(subtract, 1000);
}

//function to render random sequence
const renderSequence = function () {
    for (p = 0; p < keySequenceArray.length; p++) {
        let arrow;
        switch (keySequenceArray[p]) {
            case 37:
                arrow = "fa-arrow-alt-circle-left"

                break;
            case 38:
                arrow = "fa-arrow-alt-circle-up"

                break;

            case 39:
                arrow = "fa-arrow-alt-circle-right"

                break;

            case 40:
                arrow = "fa-arrow-alt-circle-down"

                break;

            default:

                break;
        }
        gameContainer.innerHTML += `
            <div id='${p}' class="letter-tile">
            <i class="far ${arrow} fa-lg "></i>
            </div>
            `
    }
}


//Function for reversing one arrow in the keySequenceArray
const reverseArrow = function () {

    let arrow;
    randomNumber = Math.floor(Math.random() * numOfCards)
    switch (keySequenceArray[randomNumber]) {
        case 37:
            arrow = "fa-arrow-alt-circle-right"
            break;
        case 38:
            arrow = "fa-arrow-alt-circle-down"
            break;

        case 39:
            arrow = "fa-arrow-alt-circle-left"
            break;

        case 40:
            arrow = "fa-arrow-alt-circle-up"
            break;

        default:
            break;
    }

    gameContainer.children[randomNumber].children[0].classList.remove('fa-arrow-alt-circle-left',

        'fa-arrow-alt-circle-right',
        'fa-arrow-alt-circle-up', 'fa-arrow-alt-circle-down', 'red')
    gameContainer.children[randomNumber].children[0].classList.add(`${arrow}`, 'green')
}


const startGame = () => {
    seconds = 75
    gameScore.classList.remove('hidden')
    time.classList.remove('hidden')
    startGameBtn.classList.add('hidden')
    rando(numOfCards)
    // console.log(keySequenceArray)
    // load sequence
    displaySequence()
    // checkUserInput()

}

// call hi-score from database
const getHiScores = () => {
    fetch('https://whichwayyy.herokuapp.com/api/v1/games')
        .then(res => res.json())
        .then(allGames => {
            //sort highscores
            allGames.sort(compare)

            function compare(a, b) {
                const scoreA = a.high_score;
                const scoreB = b.high_score

                let comparison = 0;
                if (scoreA < scoreB) {
                    comparison = 1;
                } else if (scoreA > scoreB) {
                    comparison = -1;
                }
                return comparison;
            }
            // all game objects from database
            allGames.slice(0, 15).forEach(game => {
                // for each player that played create a table row
                const playerHiscorreRow = document.createElement('tr')
                playerHiscorreRow.innerHTML = ``
                // add inform wihtin that table row
                scoresBody.innerHTML += `
               <td> ${game.user.username}</td>
               <td> ${game.difficulty}</td>
               <td> ${game.high_score}</td>
            `
                // hiScoreTbl.appendChild(playerHiscorreRow)
            });
        })
}


//random arrow generator
const rando = (x) => {
    for (let index = 0; index < x; index++) {
        keySequenceArray.push(Math.floor(Math.random() * 4) + 37)
    }
}

//shows the key sequence
const displaySequence = () => {
    allowKeyPress = false
    renderSequence()

    switch (difficulty) {
        case "Hard":
            reverseArrow()
            break;

        default:
            break;
    }
    if (seconds > (delaySeconds / 1000))

        setTimeout(() => {
            const letterTiles = document.querySelectorAll('.letter-tile')
            // debugge
            letterTiles.forEach(
                kid => {

                    kid.children[0].classList.remove('fa-arrow-alt-circle-left', 'fa-arrow-alt-circle-right',
                        'fa-arrow-alt-circle-up', 'fa-arrow-alt-circle-down', 'far', 'green')

                    kid.children[0].classList.add('fas', 'fa-question', 'red')
                    allowKeyPress = true
                }
            )

        }, delaySeconds);
    if (correctLines % 5 === 0) {
        // console.log("before:", numOfCards)
        numOfCards++
        correctLines++
        // console.log("4 %", numOfCards, correctLines)
    }
}

//user input conditions
// listening for user input
document.addEventListener('keydown', e => {
    if (allowKeyPress === true) {
        if (e.keyCode === keySequenceArray[0]) {

            // console.log('correct', e.key.slice(5).toLowerCase())

            gameContainer.children[consecIndex].children[0].classList.remove(`fa-arrow-alt-circle-${e.key.slice(5).toLowerCase()}`, 'far', 'fas', 'fa-question')

            gameContainer.children[consecIndex].children[0].classList.add('fa-check', 'fas', 'green')

            consecIndex++;

            keySequenceArray.shift()
            // try to have last check mark display
            if (keySequenceArray.length === 0 && seconds !== 0) {
                allowKeyPress = false
                setTimeout(() => {
                    allowKeyPress = true
                    currentScore += 100
                    gameScore.innerText = currentScore
                    consecIndex = 0
                    rando(numOfCards)
                    gameContainer.innerHTML = ''

                    ++correctLines

                    displaySequence()
                }, 500)
            }

        } else {
            // console.log('smh first', keySequenceArray[0])

            // console.log('my keyyyyy', e.keyCode)
            // console.log("whole thing", keySequenceArray)
            keySequenceArray = []
            consecIndex = 0
            rando(numOfCards)
            gameContainer.innerHTML = ''
            displaySequence()
        }
    }
})

// function gameTimer()
// *****************************************
// end of delcaration
// ******************************************

// trying to create username and a game instance at the same time....
newUserForm.addEventListener('submit', (e) => {
    e.preventDefault()
    difficulty = userDifficultySelect.value
    fetch('https://whichwayyy.herokuapp.com/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({

            username: newUser.value.toUpperCase(),
        }),
    })
        .then(res => res.json())
        .then(player => {

            loggedInUser = player.username
            newUserForm.classList.add('hidden');
            currentPlayer.innerHTML =
                `
            <p> current player is ${loggedInUser}</p>
            <h3>${difficulty} MODE</h3>
            `
            currentPlayerId = player.id
        })
    gameSettings()
    newUserForm.reset()
    logOutBtn.classList.remove("hidden")
    startGameBtn.classList.remove("hidden")
    gameCover.classList.remove('hidden')

    // myStatsBtn.classList.remove("hidden")
})

// refactor for post request to db
// const addUser = () =>{
// }

// logout, clears current user and hides logged in buttons
logOutBtn.addEventListener('click', (e) => {
    if (gameActive === false) {
        gameCover.classList.add('hidden')
        newUserForm.classList.remove('hidden');
        loggedInUser = "";
        currentPlayer.innerHTML = ""
        gameContainer.innerHTML = ""
        logOutBtn.classList.add("hidden")
        startGameBtn.classList.add("hidden")
        // myStatsBtn.classList.add("hidden")
        restartGameBtn.classList.add("hidden")
        gameScore.classList.add("hidden")
        time.innerHTML = ''
        time.classList.add("hidden")

    }
})

// toggle hiscore menu when hiscore btn is clicked
hiScoreBtn.addEventListener('click', (e) => {
    // ternary -- add/remove hidden class to table
    hiScoreTbl.classList.value.includes('hidden') ? hiScoreTbl.classList.remove('hidden') : hiScoreTbl.classList.add('hidden');

    if (hiScoreTbl.classList.value.includes('hidden') === false) {
        scoresBody.innerHTML = ``
        getHiScores()
    }
})

// toggles stats of current user

// myStatsBtn.addEventListener('click', e => {
//     fetch('http://localhost:3000/api/v1/games')
//         .then(res => res.json())
//         .then(stats => {
//             let counteee = 0;
//             stats.forEach(stat => {
//                 if (stat.user.username === loggedInUser) {
//                     counteee++
//                 }
//             })
//             console.log(counteee)
//         })
// })


startGameBtn.addEventListener('click', e => {
    gameActive = true
    keySequenceArray = []
    correctLines = 1
    currentScore = 0
    gameScore.innerText = 0
    gameContainer.innerHTML = ""
    startGame()
    timer()
    // checkUserInput()
    restartGameBtn.classList.remove("hidden")
})


restartGameBtn.addEventListener('click', e => {
    clearTimeout(t)
    gameActive = true
    consecIndex = 0
    correctLines = 1
    currentScore = 0
    gameContainer.innerHTML = ""
    keySequenceArray = []
    gameScore.innerText = 0
    gameSettings()
    startGame()
    timer()

})

playInfo.addEventListener('click', e => {

    if (playArt.classList.value.includes('hidden')) {
        playArt.classList.remove('hidden')

        // boxTwo.classList.add('hidden');
    } else {
        playArt.classList.add('hidden');
        // bowTwo.classList.remove('hidden');

    }
})
