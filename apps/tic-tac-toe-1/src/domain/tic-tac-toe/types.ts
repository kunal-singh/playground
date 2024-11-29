
export const GRID_SIZE = 3;

export type Player = "X" | "O"

export type GameType = {
    player:Player,
    boardState: Player[][],
    pick: (posX: number, posY:number, player:Player) => void,
    winner: Player | null
}

