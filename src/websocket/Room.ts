import { generateUniqueId, stringifyMessageData } from '../utils/helpers'
import { Ship } from '../utils/interfaces'
import GameManager from './GameManager'
import Game from './Game'
import Player from './Player'

export default class Room {
  public roomId: string
  public roomUsers: {
    name: string
    index: string
  }[] = []
  public game?: Game
  private _players: Player[] = []
  private _isGameCreated: boolean = false

  constructor(
    private _gameManager: GameManager
  ) {
    this.roomId = generateUniqueId()
  }

  public get isGameCreated(): boolean {
    return this._isGameCreated
  }

  public addPlayer(player: Player) {
    this._players.push(player)
    this.roomUsers.push({ name: player.name, index: player.id })

    if (this._players.length === 2 && !this._isGameCreated) {
      this.createGame()
    }
  }

  public removePlayer(player: Player) {
    this._players = this._players.filter((p) => p.id !== player.id)
    this.roomUsers = this.roomUsers.filter((user) => user.index !== player.id)
  }

  public createGame() {
    this._isGameCreated = true

    for (let player of this._players) {
      player.ws.send(
        stringifyMessageData('create_game', {
          idGame: this.roomId,
          idPlayer: player.id,
        })
      )
    }
  }

  public addShips(playerId: string, ships: Ship[]) {
    const player = this._players.find((p) => p.id === playerId)

    if (!player) {
      console.error('Player not found in the room')
      return
    }

    player.ships = ships
    player.ships.forEach((ship) => {
      ship.hits = 0
    })
    player.isReady = true
    const allReady = this._players.every((p) => p.isReady)

    if (allReady) {
      this._startGame()
    }
  }

  private _startGame() {
    this.game = new Game(
      this.roomId,
      this._players,
      this._gameManager
    )

    for (let player of this._players) {
      player.ws.send(
        stringifyMessageData('start_game', {
          ships: player.ships,
          currentPlayerIndex: player.id,
        })
      )
    }

    this.game.startGame()
  }
}
