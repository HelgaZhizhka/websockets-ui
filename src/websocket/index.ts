import { WebSocket, MessageEvent } from 'ws'

import { gameStore } from '../db/gameStore'
import { Data } from '../utils/interfaces'
import { stringifyMessageData, parseMessageData } from '../utils/helpers'
import PlayerManager from './PlayerManager'
import RoomManager from './RoomManager'
import Player from './Player'
import Room from './Room'

const playerManager = new PlayerManager(gameStore)
const roomManager = new RoomManager(gameStore)

export const handleConnection = (ws: WebSocket) => {
  let player: Player
  let room: Room

  ws.onmessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data.toString())
    const { type, data } = message
    const messageData = parseMessageData(data)
    // console.log(type, messageData)

    switch (type) {
      case 'reg':
        player = playerManager.registerPlayer(
          messageData.name,
          messageData.password,
          ws
        )
        ws.send(stringifyMessageData('reg', player.getPlayerData()))

        if (!player.error) {
          gameStore.add(player)
          ws.send(stringifyMessageData('update_room', roomManager))
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
    if (player) {
      gameStore.delete(player)
    }
  }
}
