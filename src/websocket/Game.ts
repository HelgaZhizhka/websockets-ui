import Player from './Player'
import { Attack, Ship } from '../utils/interfaces'
import {
  stringifyMessageData,
  createGameBoard,
} from '../utils/helpers'

export default class Game {
  public idGame: string
  public players: Player[]
  public currentPlayerIndex: string = ''
  private _gameBoards: Map<string, number[][]> = new Map()

  constructor(idGame: string, ...players: Player[]) {
    this.idGame = idGame
    this.players = players
  }

  public startGame() {
    this.currentPlayerIndex = this.players[1].id

    this._gameBoards = new Map(
      this.players.map((player) => [player.id, createGameBoard()])
    )
    console.log('Game started')
  }

  public attack(attackData: Attack): void {
    const { gameId, indexPlayer, x, y } = attackData

    const opponent = this.players.find((p) => p.id !== indexPlayer)

    if (!opponent) {
      console.error('Opponent not found')
      return
    }
  }

  public randomAttack(playerId: string): void {
    console.log(playerId)
  }

  public sendTurnMessage() {
    for (let player of this.players) {
      player.ws.send(
        stringifyMessageData('turn', {
          currentPlayer: this.currentPlayerIndex,
        })
      )
    }
  }

  public finishGame(winner: Player) {
    console.log('Game finished')
  }
}
