'use strict'

// GAMEBOARD FUNCTION
const gameBoard = (()=> {
    
    //Board array to register plays
    let board = ['','','','','','','','','']
    
    //Get board array
    function getBoard() {
    return board
    }

    //Reset board array and game view
    function resetBoard() {
        console.log('resetboard')
        board = ['','','','','','','','','']
        return board
    }

    // Positions in array that constitute a tictactoe win 
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
        ]

    //Add mark to game view, add mark to corresponding position in board array, call checkWinners
    function render(cell, mark, index, type) {
        if (mark!==undefined) {
            if(board[index]==='') {
            board[index]= mark
            console.log('boardrender', board)
            cell.innerText = mark
            checkWinners()
            }
        else {return false}
    }
    }

    // Check for winners and call announceWinner 
    function checkWinners() {
        console.log('wincheck')
        winCombos.some(combo => {
        if (combo.every(pos => board[pos]=='x')) {
            let playerOne = game.getPlayerOne()
            return game.announceWinner(playerOne)
        } else if (combo.every(pos=> board[pos]=='o')) {
            let playerTwo = game.getPlayerTwo()
            return game.announceWinner(playerTwo)
        } else if (combo.every(pos => board[pos]!=='x')&& combo.every(pos=> board[pos]!=='o') && !board.includes('')) {
            return game.announceWinner()
        } else if (combo.every(pos => board[pos]!=='x')&& combo.every(pos=> board[pos]!=='o') && board.includes('')) {
            setTimeout(getCheckBot,200)
        }
        })}
    
    function getCheckBot() {
        return game.checkBot()
    }

    return {
        getBoard: getBoard, 
        render:render, 
        checkWinners: checkWinners, 
        resetBoard:resetBoard
    }
    })();


// PLAY GAME FUNCTION
const game = (() => {

    // Create variables and event listeners
        let playerOne = null
        let playerTwo = null
        let turn = true

        

        const cells = document.querySelectorAll('.cell');
        const dialogBtn = document.getElementById('dialogBtn');
        const playerDialog = document.getElementById('player-dialog')
        const playerBtns = document.querySelectorAll('.player-btn')
        const submitBtn = document.getElementById('submit-btn')
        const choosePlayerOne = document.getElementById('player1')
        const choosePlayerTwo = document.getElementById('player2')
        const errorMsg = document.getElementById('error-msg')
        const winnerDialog = document.getElementById('winner-dialog')
        const winner = document.getElementById('winner')
        const restarts = document.querySelectorAll('.play-agn')
        const nameOne = document.getElementById('player1-name')
        const nameTwo = document.getElementById('player2-name')
        const turnDisplay =document.getElementById('turn-display')


        // Open dialog to choose players
        dialogBtn.addEventListener('click', () => {
            dialogBtn.style.animation = 'none';
            resetPlay()
            gameBoard.resetBoard()
            playerDialog.showModal();
        }),

        // Choose player in playerDialog
        playerBtns.forEach(playerBtn =>
            playerBtn.addEventListener("click", (e) =>{
            choosePlayer(e)
        }))

        // Submit players in playerDialog
        submitBtn.addEventListener('click', (e) =>{
            submitPlayers(e)
        })

        // Restart gameplay
        restarts.forEach(restart => {
            restart.addEventListener('click', ()=>{
                console.log('restart')
                winnerDialog.close()
                gameBoard.resetBoard()
                resetPlay()
                dialogBtn.style.animation = 'flash 3s infinite';
            })
        })

        // Users selection in tictactoe gameplay
        cells.forEach(cell =>
            cell.addEventListener('click', () => {
                playTurn(cell)
            }))
    
    //Gameplay functions
    
        // Assign players based on user selection. Edit background colour of selected buttons to display user choice    
        function choosePlayer(e) {
            e.preventDefault()
            e.target.style.backgroundColor = (e.target.style.backgroundColor === "#6B8E23") ? "#21482E" : "#6B8E23"
            e.target.dataset.indexNumber = 1
            if (e.target.id == 'player1') {
                nameOne.classList.remove('hidden')
            } else if (e.target.id == 'player2') {
                nameTwo.classList.remove('hidden')
            } else if (e.target.id == 'bot1'){
                nameOne.classList.add('hidden')
            } else if (e.target.id == 'bot2'){
                nameTwo.classList.add('hidden')
            }
            let siblingBtn = Array.from(e.target.parentElement.children).find(child => child !== e.target)
            if (siblingBtn) {
                siblingBtn.style.backgroundColor = "#21482E";
                siblingBtn.dataset.indexNumber = 0
            }
            console.log('p1', e.target.dataset.indexNumber)
            console.log('p2',siblingBtn.dataset.indexNumber)
        }

        // Called with submit btn in playerDiaolog. Assigns players and marks, closes dialog
        function submitPlayers(e) {
            e.preventDefault()
            if (choosePlayerOne.dataset.indexNumber==1){
                playerOne = (nameOne.value === '')? Player('Player 1', 'x', 'human') : Player(nameOne.value, 'x', 'human')
            }else if (choosePlayerOne.dataset.indexNumber==0 ) playerOne = Player('Bot 1', 'x', 'bot')
            console.log(playerOne)

            if (choosePlayerTwo.dataset.indexNumber==1) {
                playerTwo = (nameOne.value === '')? Player('Player 2', 'o', 'human') : Player(nameTwo.value, 'o', 'human')      
            } else if (choosePlayerTwo.dataset.indexNumber==0) playerTwo = Player('Bot 2', 'o', 'bot')
                console.log(playerTwo)

            if (playerOne!==null && playerTwo!==null) {
                playerDialog.close()
                errorMsg.innerText = ""
                gameBoard.resetBoard()
                turnDisplay.innerText= "TURN: " + playerOne.name
                setTimeout(checkBot,100)
            } else {errorMsg.innerText = "*Please select players!"}
            return {playerOne, playerTwo}
        }
        
        // Get players
        function getPlayerOne() {
            return playerOne
        }

        function getPlayerTwo() {
            return playerTwo
        }
    
        // Called when player clicks on tictactoe cell. Alternates player turns and calls render OR endGame if board array is full 
        function playTurn(cell) {
            console.log(turn)
            const index = cell.id.slice(4,5)
            console.log(index)
                if (turn === true && playerOne.type == 'human') {
                    turn = false
                    gameBoard.render(cell, playerOne.mark, index)
                    turnDisplay.innerText="TURN: " + playerTwo.name
                }else if (turn === false && playerTwo.type == 'human'){
                    turn=true
                    gameBoard.render(cell, playerTwo.mark, index)
                    turnDisplay.innerText="TURN: " + playerOne.name
                }else return false
            
        }

        function checkBot() {
            console.log('botcheck')
            let gameBoardArray = gameBoard.getBoard()
            if (!gameBoardArray.includes('')) gameBoard.checkWinners()
            else if (playerOne.type=='bot' && turn == true || playerTwo.type=='bot' && turn == false) {
                randomPickBot()
            }
            else return false
        }

        
        function randomPickBot() {
            let options = [0,1,2,3,4,5,6,7,8]
            let randomI = options[Math.floor(Math.random() * options.length)];
            console.log(randomI)
            let botCell = cells[randomI]
            botTurn(botCell, randomI)
        }

        function botTurn(botCell,randomI) {
            const gameBoardArray = gameBoard.getBoard()
            console.log('bot before',gameBoardArray)
            if (gameBoardArray[randomI] !== '') randomPickBot()
            else {
                if (turn===true) {
                    console.log('b1')
                    turn=false
                    turnDisplay.innerText="TURN: " + playerTwo.name
                    gameBoard.render(botCell, playerOne.mark, randomI, playerOne.type)
                } else if (turn==false) {
                    console.log('b2')
                    turn=true
                    gameBoard.render(botCell, playerTwo.mark, randomI, playerTwo.type)
                    turnDisplay.innerText="TURN: " + playerOne.name
                }
            }}
        
        // Called when a player wins OR the board array is full. 
        function announceWinner(result) {
            let winName = "No one! It's a draw."
            if (result == playerOne) {
                winName = playerOne.name.toString()
            } else if (result == playerTwo){
                winName = playerTwo.name.toString()
            } 
            winner.innerText = winName
            winnerDialog.showModal()
        }    

        // Reset gameplay: player allocation, turn allocation, playerBtns, tictactoe cells.
        function resetPlay() {
            playerOne = null
            playerTwo = null
            nameOne.value = ''
            nameTwo.value = ''
            turn = true
            nameOne.classList.add('hidden')
            nameTwo.classList.add('hidden')
            turnDisplay.innerText=''
            playerBtns.forEach(playerBtn => {playerBtn.style.backgroundColor = "#21482E", playerBtn.dataset.indexNumber = 3})
            cells.forEach(cell=> cell.innerText='')
        }


        return {submitPlayers:submitPlayers, announceWinner: announceWinner,
            getPlayerOne:getPlayerOne, getPlayerTwo:getPlayerTwo, randomPickBot:randomPickBot, checkBot:checkBot}

    
})()



// PLAYER FACTORY
const Player = (name, mark, type) => {
return {
name,
mark,
type
}
}


