import { generateUniqueId, stringifyMessageData } from '../utils/helpers'
import { Ship } from '../utils/interfaces'
import Game from './Game'
import Player from './Player'

export default class Room {
  roomId: string
  roomUsers: {
    name: string
    index: string
  }[] = []
  private _players: Player[] = []
  private _isGameCreated: boolean = false

  constructor(private _gameStore: Set<Player>) {
    this.roomId = generateUniqueId()
    this._gameStore = _gameStore
  }

  public get isGameCreated(): boolean {
    return this._isGameCreated
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
    this._isGameCreated = true
    for (let playerGame of this._players) {
      playerGame.ws.send(
        stringifyMessageData('create_game', {
          idGame: this.roomId,
          idPlayer: playerGame.id,
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
    player.isReady = true
    const allReady = this._players.every((p) => p.isReady)

    if (allReady) {
      this._startGame()
    }
  }

  private _startGame() {
    console.log('game started')
    const game = new Game(this._gameStore, this.roomId, ...this._players)

    for (let player of this._players) {
      player.game = game
    }

    const firstPlayerId = this._players[0].id
    game.currentPlayerIndex = firstPlayerId

    this._players.forEach((player) => {
      player.ws.send(
        stringifyMessageData('start_game', {
          ships: player.ships,
          currentPlayerIndex: firstPlayerId,
        })
      )
    })
    console.log(firstPlayerId)
    game.sendTurnMessage()
  }
}
