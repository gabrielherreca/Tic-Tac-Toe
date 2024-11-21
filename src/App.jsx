import {useState} from "react";
import confetti from "canvas-confetti"



function App() {
    const Turns = {
        X: "×",
        O: "o"
    }
    const winningBoards = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const [board, setBoard] = useState(() => {
        const boardFromLocalStorage = JSON.parse(window.localStorage.getItem('board'))

        return boardFromLocalStorage ??  Array(9).fill(null)
    })


    const [turn, setTurn] = useState(() => {
        const turnFromLocalStorage = window.localStorage.getItem('turn')
        return turnFromLocalStorage ??  Turns.X
    })
    const [winner, setWinner] = useState(null)

    const Square = ({children, updateBoard, isSelected, index}) => {
        const selected = `square ${isSelected ? "is-selected" : ""} `

        return (<div onClick={() => updateBoard(index)} className={selected}>{children}</div>)
    }

    const changeTurn = () => {
        const newTurn = turn === Turns.X ? Turns.O : Turns.X
        window.localStorage.setItem('turn' , String(newTurn))
        setTurn(newTurn)
    }

    const checkWinner = (boardToCheck) => {
        for (const winningBoard of winningBoards) {
            const [a, b, c] = winningBoard
            if (boardToCheck[a] && boardToCheck[b] === boardToCheck[a] && boardToCheck[b] === boardToCheck[c]) return boardToCheck[a]
        }
        return null
    }

    const checkIsTie = (boardToCheck) => {
       return boardToCheck.every(square => square !== null)
    }

    const updateBoard = (index) => {

        if (board[index] || winner) return;


        changeTurn()
        const newBoard=writeBoard(index)
        const checkedWinner = checkWinner(newBoard)
        const isTie = checkIsTie(newBoard)

        window.localStorage.setItem('board' , JSON.stringify(newBoard))


        if(checkedWinner) {

            confetti()
            setWinner(checkedWinner)
        }

       else if(isTie) {

            setWinner("-")
        }



    }

    const writeBoard = (index) => {
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
        return newBoard
    }

    const resetGame = () =>
    {
            setBoard(Array(9).fill(null))
            setTurn(Turns.X)
            setWinner(null)
            window.localStorage.clear()

    }


    return (
        <>
            <main className={"board"}>
                <h1>Tic Tac Toe</h1>
                <button onClick={resetGame}>Reset</button>
                <section className={"game"}>
                    {
                        board.map((_, index) => {
                            return (
                                <Square updateBoard={updateBoard} key={index} index={index}>{board[index]}</Square>
                            );
                        })
                    }
                </section>
                <h2 className={"Playing"}>Playing :</h2>
                <section className={"turn"}>

                    <Square isSelected={turn === Turns.X}>{Turns.X}</Square>
                    <Square isSelected={turn === Turns.O}>{Turns.O}</Square>
                </section>
                {
                    winner !== null && (
                        <section className={"winner"}>
                            <div className={"text"}>
                                <h2>{winner === "-" ? "Empate" : "Ganó : "}</h2>
                                <header className={"win"}>
                                    {<Square>{winner}</Square>}
                                </header>
                                <footer>
                                    <button onClick={resetGame}>New Game</button>
                                </footer>
                            </div>
                        </section>
                    )


                }
            </main>

        </>
    )

}

export default App
