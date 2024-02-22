import { randomUUID } from 'crypto'

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

export const stringifyMessageData = (type: string, data: {}, id: number = 0) => {
  return JSON.stringify({
    type: type,
    data: JSON.stringify(data),
    id: id,
  })
}

export const createGameBoard = (): number[][] => {
  const size = 10
  const gameBoard = Array.from({ length: size }, () => Array(size).fill(0))
  return gameBoard
}

