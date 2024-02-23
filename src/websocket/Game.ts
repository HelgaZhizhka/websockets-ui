import Player from './Player'
import GameManager from './GameManager'
import { Attack, GameField } from '../utils/interfaces'
import { stringifyMessageData, createGameBoard } from '../utils/helpers'

export default class Game {
  public idGame: string
  public players: Player[]
  public currentPlayerIndex: string = ''
  public currentPlayer: Player
  public opponent: Player
  private _gameBoards: Map<string, GameField> = new Map()

  constructor(
    idGame: string,
    players: Player[],
    private _gameManager: GameManager
  ) {
    this.idGame = idGame
    this.players = players
    this.currentPlayer = players[0]
    this.opponent = players[1]
    players.forEach((player) => {
      const gameBoard = createGameBoard(player.ships ?? [])
      this._gameBoards.set(player.id, gameBoard)
    })
  }

  public startGame() {
    this.sendTurnMessage()
  }

  public attack(attackData: Attack): void {
    const { indexPlayer, x, y } = attackData

    if (indexPlayer !== this.currentPlayer.id) {
      console.error('Not your turn')
      return
    }

    const gameBoard = this._gameBoards.get(this.opponent.id)

    if (!gameBoard) {
      console.error('Game board for the opponent not found')
      return
    }

    const cell = gameBoard[y][x]

    if (cell.isShot) {
      console.log('Cell already attacked')
      return
    }

    cell.isShot = true

    let status: 'miss' | 'shot' | 'killed' = 'miss'

    if (!cell.isEmpty) {
      status = 'shot'
      const ship = cell.ship

      if (ship) {
        ship.hits += 1

        if (ship.hits === ship.length) {
          ship.isSunk = true
          status = 'killed'

          if (this._checkWin(this.opponent.id)) {
            this.finishGame(this.currentPlayer)
          }
        }
      }
    }

    if (status !== 'killed' && status !== 'shot') {
      this._changeTurn()
    }

    if (!this._checkWin(this.opponent.id)) {
      this.sendAttackResult(indexPlayer, { x, y, status })
    }
  }

  private _changeTurn(): void {
    ;[this.currentPlayer, this.opponent] = [this.opponent, this.currentPlayer]
    this.sendTurnMessage()
  }

  private _checkWin(playerId: string): boolean {
    const gameBoard = this._gameBoards.get(playerId)
    if (!gameBoard) return false

    return gameBoard.every((row) =>
      row.every((cell) => cell.isEmpty || (cell.ship && cell.ship.isSunk))
    )
  }

  public getOpponentId(playerId: string): string {
    return this.players.find((player) => player.id !== playerId)!.id
  }

  public randomAttack(playerId: string): void {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    this.attack({ gameId: this.idGame, indexPlayer: playerId, x, y })
  }

  public sendTurnMessage() {
    for (let player of this.players) {
      player.ws.send(
        stringifyMessageData('turn', {
          currentPlayer: this.currentPlayer.id,
        })
      )
    }
  }

  public sendAttackResult(
    playerId: string,
    {
      x,
      y,
      status,
    }: { x: number; y: number; status: 'miss' | 'shot' | 'killed' }
  ) {
    this.players.forEach((player) => {
      player.ws.send(
        stringifyMessageData('attack', {
          currentPlayer: playerId,
          position: { x, y },
          status,
        })
      )
    })
  }

  public finishGame(winner: Player) {
    console.log(`Game finished, winner is ${winner.id}`)
    winner.wins += 1
    this.players.forEach((player) => {
      player.ships = []
      player.isReady = false
      player.ws.send(stringifyMessageData('finish', { winPlayer: winner.id }))
    })

    this._gameManager.getWinnersData()
  }
}
