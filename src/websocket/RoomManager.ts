import { stringifyMessageData } from '../utils/helpers'
import GameManager from './GameManager'
import Room from './Room'
import Player from './Player'

export default class RoomManager {
  private _rooms: Room[] = []

  constructor(
    private _playerStore: Set<Player>,
    private _gameManager: GameManager
  ) {
    this._playerStore = _playerStore
  }

  public get rooms() {
    return this._rooms.filter((room) => !room.isGameCreated)
  }

  public createRoom(player: Player) {
    this.removePlayerFromCurrentRoom(player)
    const room = new Room(this._gameManager)
    this._rooms.push(room)
    this._broadcast()
    return room
  }

  public getRoom(roomId: string) {
    return this._rooms.find((room) => room.roomId === roomId)
  }

  public addPlayer(roomId: string, player: Player) {
    this.removePlayerFromCurrentRoom(player)
    const room = this.rooms.find((room) => room.roomId === roomId)

    if (!room || room.isGameCreated || room.roomUsers.length === 2) {
      return null
    }

    room.addPlayer(player)
    this._broadcast()

    return room
  }

  public removePlayerFromCurrentRoom(player: Player) {
    const currentRoom = this.rooms.find((room) =>
      room.roomUsers.some((user) => user.index === player.id)
    )

    if (currentRoom) {
      currentRoom.removePlayer(player)
    }

  }

  public findRoomByPlayerId(playerId: string): Room | undefined {
    return this._rooms.find((room) =>
      room.roomUsers.some((user) => user.index === playerId)
    )
  }

  public closeRoom(roomId: string): void {
    const roomIndex = this._rooms.findIndex((room) => room.roomId === roomId)

    if (roomIndex !== -1) {
      const room = this._rooms[roomIndex]

      room.players.forEach((player) => {
        player.ws.send(
          stringifyMessageData('room_closed', { roomId: room.roomId })
        )
      })

      this._rooms.splice(roomIndex, 1)

      this._broadcast()
    }
    
  }

  private _broadcast() {
    for (const player of this._playerStore) {
      player.ws.send(stringifyMessageData('update_room', this.rooms))
    }
  }
}
