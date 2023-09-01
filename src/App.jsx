import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { Winner } from './components/Winner'
import './App.css'



function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board') 
    return boardFromStorage ? JSON.parse(boardFromStorage) :
    Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.x
  })
  const [winner, setWinner] = useState(null)

  // Reiniciar juego al presionar el boton
  const resetGame = () => {
    setBoard(()=> Array(9).fill(null))
    setTurn(TURNS.x)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    if (board[index] || winner ) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x
    setTurn(newTurn)

    // guardamos partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    // revisamos si existe ganador
    const newWinner = checkWinnerFrom(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }
  
  return (
  <main className='board'>
    <h1>Tic Tac Toe</h1>
    <button onClick={resetGame}>Reiniciar juego</button>

    <section className='game'> 
    {
      board.map((square, index) => {
        return (
          <Square
          key={index}
          index={index}
          updateBoard={updateBoard}
          >
            {square}
          </Square>
        )
      })
    }
    </section>
    <section className="turn">
      <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
      <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
    </section>
    <Winner resetGame={resetGame} winner={winner}/>
  </main>
  )
}
export default App