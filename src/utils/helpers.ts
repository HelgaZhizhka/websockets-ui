import { randomUUID } from 'crypto'

import { GameField, GameFieldCell, Ship } from './interfaces'

export const generateUniqueId = (): string => {
  return randomUUID()
}

export const parseMessageData = (message: string) => {
  try {
    return JSON.parse(message)
  } catch {
    return null
  }
}

export const stringifyMessageData = (
  type: string,
  data: {},
  id: number = 0
) => {
  return JSON.stringify({
    type: type,
    data: JSON.stringify(data),
    id: id,
  })
}

export const FIELD_SIZE = 10

export const createGameBoard = (ships: Ship[]): GameField => {
  const field: GameField = Array.from({ length: FIELD_SIZE }, () =>
    Array.from(
      { length: FIELD_SIZE },
      (): GameFieldCell => ({
        isEmpty: true,
        isShot: false,
        isSunk: false,
        ship: null,
        isNearShip: false,
      })
    )
  )

  ships.forEach((ship) => {
    for (let i = 0; i < ship.length; i++) {
      const x = ship.direction ? ship.position.x : ship.position.x + i
      const y = ship.direction ? ship.position.y + i : ship.position.y

      if (x < FIELD_SIZE && y < FIELD_SIZE) {
        field[y][x] = {
          ...field[y][x],
          isEmpty: false,
          ship: ship,
        }
      }
    }
    markCellsAroundShip(field, ship)
  })

  return field
}

export const markCellsAround = (
  field: GameField,
  x: number,
  y: number,
  action: (cell: GameFieldCell, x: number, y: number) => void
): void => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  directions.forEach(([dx, dy]) => {
    const newX = x + dx,
      newY = y + dy

    if (newX >= 0 && newX < FIELD_SIZE && newY >= 0 && newY < FIELD_SIZE) {
      action(field[newY][newX], newX, newY)
    }

  })
}

const markCellsAroundShip = (field: GameField, ship: Ship): void => {
  markCellsAround(field, ship.position.x, ship.position.y, (cell, x, y) => {

    if (cell.isEmpty) {
      cell.isNearShip = true
    }
    
  })
}
