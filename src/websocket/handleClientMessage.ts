import { WebSocket } from 'ws'


import GameManager from './GameManager'
import Player from './Player'
import Room from './Room'


const gameManager = new GameManager()

export const handleClientMessage = (
  type: string,
  data: string,
  player: Player,
  room: Room,
  ws: WebSocket
) => {
  let gameData
  if (data) {
    gameData = JSON.parse(data)
  }

 
}
