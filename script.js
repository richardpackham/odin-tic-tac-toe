// You’re going to store the gameboard as an array inside of a Gameboard object,
// so start there! Your players are also going to be stored in objects, 
// and you’re probably going to want an object to control the flow of the game itself. 
const Player = (name, marker) => {
    const getMarker = () => {
        return marker
    }
    return { name, marker, getMarker };
}
// create array 
const Gameboard = (() => {
    let board = ["", "", "",
        "", "", "",
        "", "", ""];
    // gameboard array index
    // [0,1,2,
    //  3,4,5,
    //  6,7,8]

    const addSquare = (index, marker) => {
        if (board[index] !== "") {
            // square taken 
            console.log("Square Taken")
            return false
        }
        else {
            // set square to marker
            board[index] = marker;
            // console.log(`Added ${marker} to square ${index}`)
        }
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(`Square${i} value is ${board[i]}`);
            board[i] = "";
            console.log(`Square${i} value is ${board[i]}`)
        }
    };
    return { addSquare, resetBoard, board };
})();

const displayController = (() => {
    
    const nameChange = (e) =>{
        player = e.target.id
        console.log(player)
        const newName = prompt("New Name?")
        if (newName == null || newName == ""){
            return false
        }
        console.log(newName)
        if (player == "player1"){
            game.updatePlayerName(game.player1,newName)
        }
        else if (player == "player2"){
            game.updatePlayerName(game.player2,newName)
        }
    }
    
    const player1 = document.querySelector("#player1")
    player1.addEventListener("click",nameChange)
    const player2 = document.querySelector("#player2")
    player2.addEventListener("click",nameChange)

    const restartGame = () =>{
        Gameboard.resetBoard()
        renderBoard()
        addMessage("")
    }
    const reset = document.querySelector("#reset")
    reset.addEventListener("click",restartGame)

    const addMessage = (message) =>{
        let messageNode = document.querySelector("#message")
        messageNode.innerText = message
    };

    
    const handleClick = (e) =>{
        console.log(e)
        square = e.target.dataset.index
        game.playRound(square)
    };
    const renderBoard =() => {
        boardWrapper = document.querySelector("#boardWrapper")
        p1 = document.querySelector("#player1Name")
        p2 = document.querySelector("#player2Name")
        p1.innerText = game.player1.name + " playing as " + game.player1.marker
        p2.innerText = game.player2.name + " playing as "+ game.player2.marker

        // clear Board
        boardWrapper.replaceChildren()
        for (let square in Gameboard.board){
            let div = document.createElement("div")
            div.innerText= Gameboard.board[square]
            div.addEventListener("click",handleClick)
            div.setAttribute("data-index",square)
            boardWrapper.appendChild(div)
        }

    };
    return { renderBoard , addMessage}
})();

const game = (() => {
    const player1 = Player("Jim", "X")
    const player2 = Player("Bob", "O")

    const updatePlayerName = (player, name) => {
        player.name = name
        displayController.renderBoard()
    }

    const getCurrentPlayer = () => {
        const emptySquares = countEmptySquares()
        return emptySquares % 2 === 1 ? player1 : player2;
    };

    const countEmptySquares = () => {
        let count = 0;
        for (let square of Gameboard.board) {
            if (square === "") {
                count++;
            }
        }
        return count;
    };

    let solutions = [
        // Across
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Down
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonal
        [0, 4, 8],
        [2, 4, 6],
    ];


    const checkWinner = (marker , player ) => {
        for (let solution of solutions) {
            let win = solution.every((index) => Gameboard.board[index] === marker);
            if (win) {
                // Marker wins
                Gameboard.resetBoard()
                displayController.addMessage(`${player.name} wins!`)
                return true;
            }
        }
        // check for tie 
        if (!Gameboard.board.includes("")) {
            console.log("It's a tie!");
            Gameboard.resetBoard()
            displayController.addMessage("It's a tie!")
            return true;
        }
        else {
            displayController.addMessage("")
        }
        return false;
    };

    const playRound = (square) => {
        const player = getCurrentPlayer()
        const marker = player.getMarker()
        // call function to ask for input// in gui version can just pass the sqyare clicked into function
        // const square = prompt(`${player.name} what Square`)
        Gameboard.addSquare(square, marker)
        displayController.renderBoard()
        checkWinner(marker, player)    
    };

    return { playRound,player1,player2,updatePlayerName};
})();
game.playRound()


displayController.renderBoard()