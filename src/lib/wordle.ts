export type TileState = "correct" | "present" | "absent" | "empty";

export interface Tile {
  letter: string;
  state: TileState;
}

export interface GameState {
  board: Tile[][];
  currentRow: number;
  currentCol: number;
  targetWord: string;
  gameOver: boolean;
  won: boolean;
  message: string;
}

const WORD_LENGTH = 5;
const MAX_ROWS = 6;

export function createEmptyBoard(): Tile[][] {
  return Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      state: "empty" as TileState,
    }))
  );
}

export function createGameState(targetWord: string): GameState {
  return {
    board: createEmptyBoard(),
    currentRow: 0,
    currentCol: 0,
    targetWord: targetWord.toUpperCase(),
    gameOver: false,
    won: false,
    message: "",
  };
}

export function evaluateGuess(guess: string, target: string): Tile[] {
  const upperGuess = guess.toUpperCase();
  const upperTarget = target.toUpperCase();
  const result: Tile[] = [];
  const targetLetters = upperTarget.split("");
  const guessLetters = upperGuess.split("");

  const targetCount: Record<string, number> = {};
  for (const letter of targetLetters) {
    targetCount[letter] = (targetCount[letter] || 0) + 1;
  }

  const resultStates: TileState[] = Array(WORD_LENGTH).fill("absent");

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      resultStates[i] = "correct";
      targetCount[guessLetters[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (resultStates[i] === "correct") continue;
    if (targetCount[guessLetters[i]] > 0) {
      resultStates[i] = "present";
      targetCount[guessLetters[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    result.push({
      letter: guessLetters[i],
      state: resultStates[i],
    });
  }

  return result;
}

export function addLetter(state: GameState, letter: string): GameState {
  if (state.gameOver || state.currentCol >= WORD_LENGTH) return state;

  const newBoard = state.board.map((row) => [...row]);
  newBoard[state.currentRow][state.currentCol] = {
    letter: letter.toUpperCase(),
    state: "empty",
  };

  return {
    ...state,
    board: newBoard,
    currentCol: state.currentCol + 1,
  };
}

export function removeLetter(state: GameState): GameState {
  if (state.gameOver || state.currentCol <= 0) return state;

  const newBoard = state.board.map((row) => [...row]);
  newBoard[state.currentRow][state.currentCol - 1] = {
    letter: "",
    state: "empty",
  };

  return {
    ...state,
    board: newBoard,
    currentCol: state.currentCol - 1,
  };
}

export function submitGuess(state: GameState): GameState {
  if (state.gameOver) return state;

  const currentGuess = state.board[state.currentRow]
    .map((tile) => tile.letter)
    .join("");

  if (currentGuess.length < WORD_LENGTH) {
    return { ...state, message: "Not enough letters" };
  }

  const evaluated = evaluateGuess(currentGuess, state.targetWord);
  const newBoard = state.board.map((row) => [...row]);
  newBoard[state.currentRow] = evaluated;

  const won = currentGuess === state.targetWord;
  const lost = state.currentRow === MAX_ROWS - 1 && !won;

  return {
    ...state,
    board: newBoard,
    currentRow: state.currentRow + 1,
    currentCol: 0,
    gameOver: won || lost,
    won,
    message: won
      ? "Splendid!"
      : lost
        ? `The word was ${state.targetWord}`
        : "",
  };
}

export function getKeyboardState(board: Tile[][]): Record<string, TileState> {
  const keyStates: Record<string, TileState> = {};
  const statePriority: Record<TileState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    empty: 0,
  };

  for (const row of board) {
    for (const tile of row) {
      if (!tile.letter) continue;
      const current = keyStates[tile.letter];
      if (
        !current ||
        statePriority[tile.state] > statePriority[current]
      ) {
        keyStates[tile.letter] = tile.state;
      }
    }
  }

  return keyStates;
}

export function isValidLength(word: string): boolean {
  return word.length === WORD_LENGTH;
}

export { WORD_LENGTH, MAX_ROWS };
