import { generateUniqueId } from '../utils/helpers'
import { stringifyMessageData } from '../utils/helpers'
import Game from './Game'
import Player from './Player'

export default class Room {
  roomId: string
  roomUsers: {
    name: string
    index: string
  }[]
  private _players: Player[]
  private _isGameStarted: boolean = false

  constructor(private _gameStore: Set<Player>) {
    this.roomId = generateUniqueId()
    this.roomUsers = []
    this._players = []
    this._gameStore = _gameStore
  }

  public get isGameStarted(): boolean {
    return this._isGameStarted
  }

  public addPlayer(player: Player) {
    this._players.push(player)
    this.roomUsers.push({ name: player.name, index: player.id })

    if (this.roomUsers.length === 2) {
      this.createGame()
    }
  }

  public removePlayer(player: Player) {
    this._players = this._players.filter((p) => p.id !== player.id)
    this.roomUsers = this.roomUsers.filter((user) => user.index !== player.id)
  }

  public createGame() {
    this._isGameStarted = true
    for (let playerGame of this._players) {
      playerGame.ws.send(
        stringifyMessageData('create_game', {
          idGame: this.roomId,
          idPlayer: playerGame.id,
        })
      )
    }
  }

  public startGame() {
    const game = new Game(this._gameStore, this.roomId, ...this._players)
    for (let player of this._players) {
      player.game = game
    }
  }
}
