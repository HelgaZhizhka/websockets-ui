export interface Data {
  type: string
  data: string
  id: number
}

interface Position {
  x: number
  y: number
}

export interface Ship {
  type: 'small' | 'medium' | 'large' | 'huge'
  direction: boolean
  length: number
  position: Position
  hits: number
  isSunk: boolean
}

export interface Attack {
  indexPlayer: string
  gameId: string
  x: number
  y: number
}

export interface GameFieldCell {
  isEmpty: boolean
  isShot: boolean
  isSunk: boolean
  ship: Ship | null
  isNearShip: boolean
}

export type GameField = GameFieldCell[][]
