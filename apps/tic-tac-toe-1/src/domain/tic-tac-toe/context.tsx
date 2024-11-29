import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { GameType, GRID_SIZE, Player } from "./types";


export const GameContext = createContext<GameType | undefined>(undefined);


export const checkWinner = (boardState: GameType["boardState"]): Player | null => {
  if (!boardState) return null;

  // Check rows
  for (let i = 0; i < GRID_SIZE; i++) {
    if (boardState[i]?.every(cell => cell === boardState[i]?.[0] && cell !== null)) {
      return boardState[i]?.[0] ?? null;
    }
  }

  // Check columns
  for (let j = 0; j < GRID_SIZE; j++) {
    if (boardState.every(row => row?.[j] === boardState[0]?.[j] && row?.[j] !== null)) {
      return boardState[0]?.[j] ?? null;
    }
  }

  // Check diagonal
  if (boardState.every((row, i) => row?.[i] === boardState[0]?.[0] && row?.[i] !== null)) {
    return boardState[0]?.[0] ?? null;
  }

  // Check anti-diagonal
  if (boardState.every((row, i) => row?.[GRID_SIZE - 1 - i] === boardState[0]?.[GRID_SIZE - 1] && row?.[GRID_SIZE - 1 - i] !== null)) {
    return boardState[0]?.[GRID_SIZE - 1] ?? null;
  }

  return null;
};

export const GameProvider = ({children}:{children: ReactNode}) => {

    const [boardState, setBoardState] = useState<GameType["boardState"]>(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(null)));
    const [player, setPlayer] = useState<Player>("X");
    const [winner, setWinner] = useState<Player | null>(null);
    

    const pick: GameType["pick"] = useCallback((x,y,p)=>{
        if(winner || boardState?.[x]?.[y]){
            return;
        }
        
        const newState = JSON.parse(JSON.stringify(boardState));
        newState[x][y] = player;
        
        // Check winner before state updates
        const newWinner = checkWinner(newState);
        
        // Batch state updates together
        setBoardState(newState);
        if(newWinner) {
            setWinner(newWinner);
        }
        setPlayer(prev => prev === "X" ? "O" : "X");
    },[player, boardState, winner]);

    const initialValue = useMemo(()=>({
        player,
        boardState,
        pick,
        winner
    } as GameType),[player, boardState])

    return <GameContext.Provider value={initialValue}>{children}</GameContext.Provider>
}

export const useGame = () => {
    const context = useContext(GameContext);
    if(!context){
        throw Error("Invalid position for hook");
    }
    return context;
}