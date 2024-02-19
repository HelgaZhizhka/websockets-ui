import { generateUniqueId } from '../utils/helpers'
import { Ship } from '../utils/interfaces'
import Game from './Game'
import Player from './Player'

export default class Room {
  roomId: string
  roomUsers: {
    name: string
    index: string
  }[]
  private _players: Player[]
  private _isStart: number

  constructor(private _gameStore: Set<Player>) {
    this.roomId = generateUniqueId()
    this.roomUsers = []
    this._players = []
    this._isStart = 0
    this._gameStore = _gameStore
  }

  public addPlayer(player: Player) {
    // console.log(player)
    this._players.push(player)
    this.roomUsers.push({ name: player.name, index: player.id })

    if (this.roomUsers.length === 2) {
      this.createGame()
    }
  }

  public createGame() {
    for (let playerGame of this._gameStore) {
      playerGame.ws.send(
        JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({
            idGame: this.roomId,
            idPlayer: playerGame.id,
          }),
          id: 0,
        })
      )
    }
  }

  public addShips(player: Player, ships: Ship[]) {
    player.ships = ships
    this._isStart += 1
    if (this._isStart === 2) {
      this.startGame()
    }
  }

  private startGame() {
    const game = new Game(this._gameStore, this.roomId,...this._players)
    for (let player of this._players) {
      player.game = game
    }
  }
}
