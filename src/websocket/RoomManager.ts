import { stringifyMessageData } from '../utils/helpers'
import Room from './Room'
import Player from './Player'

export default class RoomManager {
  private _rooms: Room[] = []

  constructor(private _gameStore: Set<Player>) {
    this._gameStore = _gameStore
  }

  public get rooms() {
    return this._rooms.filter((room) => !room.isGameStarted)
  }

  public createRoom() {
    const room = new Room(this._gameStore)
    this._rooms.push(room)
    this._broadcast()
    return room
  }

  public addPlayer(roomId: string, player: Player) {
    this.removePlayerFromCurrentRoom(player)
    const room = this.rooms.find((room) => room.roomId === roomId)

    if (!room || room.isGameStarted || room.roomUsers.length === 2) {
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

  private _broadcast() {
    for (const player of this._gameStore) {
      player.ws.send(stringifyMessageData('update_room', this.rooms))
    }
  }
}
