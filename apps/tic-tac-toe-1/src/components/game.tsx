import { ReactNode, useCallback } from "react"
import { GRID_SIZE, Player, useGame } from "../domain/tic-tac-toe"

export const Game = ({children}:{children:ReactNode}) => {
    return <>{children}</>
}

export const Board = () => {
   const {boardState, player} = useGame();

   const renderBoard = () => {
       return boardState.map((b,x)=>b.map((bi,y)=><Square posX={x} posY={y} value={boardState?.[x]?.[y]} />))
   }

   return <div className={`grid grid-cols-3 gap-2 w-fit`}>{renderBoard()}</div>
}

export const Square = ({posX, posY, value}:{posX:number, posY:number, value: Player | undefined}) => {
   const {pick, player}=useGame();

   const handleClick = useCallback(()=>{
    pick(posX, posY, player);
   },[pick]);
   
   return <button type="button" className="button border-1 w-12 h-12 border-gray-300 text-white" onClick={handleClick}>
       {value}
   </button>
}

export const Meta = () => {
    const {player, winner} = useGame();
    return <div className="flex items-center justify-center mt-2 border border-gray-200 bg-gray-700">
        <span>Current Player : {`${player}`}</span>
        {winner && <span>WINNER : {`${winner}`}</span>}
    </div>
}

Game.Board=Board;
Game.Meta=Meta;

