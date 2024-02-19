import Room from './Room'
import Player from './Player'

export default class RoomManager {
  private _rooms: Room[] = []

  constructor(private _gameStore: Set<Player>) {
    this._gameStore = _gameStore
  }

  public createRoom() {
    const room = new Room(this._gameStore)
    this._rooms.push(room)
    this.broadcast()
    return room
  }

  public addPlayer(id: string, player: Player) {
    const room = this._rooms.find((room) => room.roomId === id)
    room?.addPlayer(player)
    //TODO some check if user is in roomUsers, delete user in prev room
    if (room?.roomUsers.length === 2) {
      this._rooms = this._rooms.filter((item) => item !== room)
    }
    console.log(this._rooms)
    this.broadcast()
    return room
  }

  private broadcast() {
    for (const player of this._gameStore) {
      player.ws.send(
        JSON.stringify({
          type: 'update_room',
          data: JSON.stringify(this._rooms),
          id: 0,
        })
      )
    }
  }
}
