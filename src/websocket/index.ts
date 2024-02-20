import { WebSocket, MessageEvent } from 'ws'

import { gameStore } from '../db/gameStore'
import { Data } from '../utils/interfaces'
import { stringifyMessageData, parseMessageData } from '../utils/helpers'
import PlayerManager from './PlayerManager'
import RoomManager from './RoomManager'
import Player from './Player'
import Room from './Room'
import GameManager from './GameManager'

const playerManager = new PlayerManager(gameStore)
const roomManager = new RoomManager(gameStore)
const gameManager = new GameManager(gameStore)

export const handleConnection = (ws: WebSocket) => {
  let player: Player
  let room: Room

  ws.onmessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data.toString()) as Data
    const { type, data } = message
    const messageData = parseMessageData(data) 

    switch (type) {
      case 'reg':
        player = playerManager.registerPlayer(
          messageData.name,
          messageData.password,
          ws
        )
        
        const playerData = player.getPlayerData()

        ws.send(stringifyMessageData('reg', playerData))

        if (!player.error) {
          gameStore.add(player)
          ws.send(stringifyMessageData('update_room', roomManager.rooms))
          ws.send(
            stringifyMessageData(
              'update_winners',
              gameManager.getWinnersData(gameStore)
            )
          )
        }

        break
      case 'create_room':
        roomManager.createRoom()
        break
      case 'add_user_to_room':
        room = roomManager.addPlayer(messageData.indexRoom, player) || room
        break
      case 'add_ships':
        break
      case 'attack':
        break
      default:
        console.log('Unknown message type:', type)
    }
  }

  ws.onclose = () => {
    console.log('Connection closed')
  }
}
