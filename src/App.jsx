// CSS
import './App.css'
// React Hooks
import { useCallback, useEffect, useState } from 'react';
// Dados
import { wordsList } from "./data/words";
// components
import TelaInicial from './components/TelaInicial';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

// quantidade de tentativas
const guessesQty = 10
function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])


  // inicio do jogo Mundo Secreto
  const startGame = useCallback(() => {
    // apagar todas letras
    clearLetterStates();
    // pick word e pick category
    const { word, category } = pickWordAndCategory()

    // create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // filtro states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  // Processo de ler input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // verifica se a letra ja foi utilizada
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // checa derrota
  useEffect(() => {
    if (guesses <= 0) {
      // reiniciar todos estagios
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses])

  // checa vitoria
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // condição de vitoria
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)
      // restartar jogo
      startGame();
    }
  }, [guessedLetters, letters, startGame])

  // Reiniciar jogo

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }



  return (
    <div className="App">
      {gameStage === 'start' && <TelaInicial startGame={startGame} />}
      {gameStage === 'game' && (<Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
