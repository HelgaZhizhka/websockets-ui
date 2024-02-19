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

export const stringifyMessageData = (type: string, data: {}) => {
  return JSON.stringify({
    type: 'reg',
    data: JSON.stringify(data),
    id: 0,
  })
}
