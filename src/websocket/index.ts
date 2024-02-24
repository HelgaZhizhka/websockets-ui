import { WebSocket, MessageEvent } from 'ws'

import { playerStore } from '../db/playerStore'
import { Attack, Data } from '../utils/interfaces'
import { stringifyMessageData, parseMessageData } from '../utils/helpers'
import PlayerManager from './PlayerManager'
import Player from './Player'
import RoomManager from './RoomManager'
import Room from './Room'
import GameManager from './GameManager'

const playerManager = new PlayerManager(playerStore)
const gameManager = new GameManager(playerStore)
const roomManager = new RoomManager(playerStore, gameManager)

export const handleConnection = (ws: WebSocket) => {
  let player: Player
  let gameRoom: Room

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
          playerStore.add(player)
          ws.send(stringifyMessageData('update_room', roomManager.rooms))
          gameManager.updateWinners()
        }

        break
      case 'create_room':
        const createdRoom = roomManager.createRoom(player)
        gameRoom = roomManager.addPlayer(createdRoom.roomId, player) || gameRoom
        break
      case 'add_user_to_room':
        gameRoom =
          roomManager.addPlayer(messageData.indexRoom, player) || gameRoom
        break
      case 'add_ships':
        gameRoom.addShips(messageData.indexPlayer, messageData.ships)
        break
      case 'attack':
        const attackData = messageData as Attack
        gameRoom.game?.attack(attackData)
        break
      case 'randomAttack':
        gameRoom.game?.randomAttack(player.id)
        break
      default:
        console.log('Unknown message type:', type)
    }
  }

  ws.onclose = () => {
    console.log('Connection closed')
    const room = roomManager.findRoomByPlayerId(player.id)

    if (room && room.game && room.players.length === 2) {
      const remainingPlayer = room.players.find((p) => p.id !== player.id)

      if (remainingPlayer) {
        remainingPlayer.wins += 1
        remainingPlayer.ws.send(
          stringifyMessageData('finish', { winPlayer: remainingPlayer.id })
        )
        gameManager.updateWinners() 
      }
      
      roomManager.closeRoom(room.roomId)
    }
  }
}
