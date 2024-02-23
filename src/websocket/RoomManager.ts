import { stringifyMessageData } from '../utils/helpers'
import GameManager from './GameManager'
import Room from './Room'
import Player from './Player'

export default class RoomManager {
  private _rooms: Room[] = []

  constructor(private _playerStore: Set<Player>, private _gameManager: GameManager) {
    this._playerStore = _playerStore
  }

  public get rooms() {
    return this._rooms.filter((room) => !room.isGameCreated)
  }

  public createRoom() {
    const room = new Room(this._gameManager)
    this._rooms.push(room)
    this._broadcast()
    return room
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

  public closeRoom(roomId: string) {
    const room = this._rooms.find((room) => room.roomId === roomId)
    if (room) {
      this._rooms = this._rooms.filter((room) => room.roomId !== roomId)
      this._broadcast()
    }
  }

  private _broadcast() {
    for (const player of this._playerStore) {
      player.ws.send(stringifyMessageData('update_room', this.rooms))
    }
  }
}
