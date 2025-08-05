import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./assets/languages";
import { getFarewellText, getRandomWord } from "./assets/utils"
import Confetti from "react-confetti"



export default function AssemblyEndgame() {
  //State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord()) //ilk seferde render, sonrakilerde ignores. lazy deniyor buna 
  const [guessedLetters, setGuessedLetters] = useState([])
  //Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  //Derived values
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameLost = wrongGuessCount < languages.length - 1 ? false : true
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  //guessedLetters.filter(letter => currentWord.includes(letter)).length === currentWord.length ? true : false
  const isGameOver = isGameLost || isGameWon
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]
    )
  }

  const languageElements = languages.map((lang, index) => {
    const isLostLanguage = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx("chip", isLostLanguage ? "lost" : "")
    return (
      <span
        className={className}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)

    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (< span className={letterClassName}
      key={index} > {
        shouldRevealLetter
          ? letter.toUpperCase()
          : null
      }
    </span >)
  }
  )


  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    if (!isGameOver) {
      return (

        <button
          className={className}
          key={letter}
          onClick={() => addGuessedLetter(letter)}
          aria-disabled={guessedLetters.includes(letter)}
        >
          {letter.toUpperCase()}
        </button>

      )
    }
    else {
      return (

        <button disabled={true}
          className={className}
          key={letter}
          onClick={() => addGuessedLetter(letter)}
          aria-disabled={guessedLetters.includes(letter)}
        >
          {letter.toUpperCase()}
        </button>

      )
    }
  })

  const gameStatusClass = clsx("game-status",
    {
      won: isGameWon,
      lost: isGameLost,
      farewell: isLastGuessIncorrect && !isGameOver
    }
  )

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>)
    }
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😂</p>
        </>
      )
    }
    return null
  }
  console.log(currentWord)
  return (
    <main>
      {isGameWon && <Confetti />}
      <header>
        <h1>Ultimate Hangman</h1>
        <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">
        {languageElements}
      </section>
      <section className="word">
        {letterElements}
      </section>
      <section className="keyboard">
        {keyboardElements}
      </section>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main >
  )
}