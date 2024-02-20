import Player from './Player'
import { Attack, Ship } from '../utils/interfaces'
import { stringifyMessageData } from '../utils/helpers'

export default class Game {
  idGame: string
  players: Player[]
  currentPlayerIndex: string = ''

  constructor(
    private _gameStore: Set<Player>,
    idGame: string,
    ...players: Player[]
  ) {
    this.idGame = idGame
    this.players = players
    this._gameStore = _gameStore
  }

  public sendTurnMessage() {
    this.players.forEach((player) => {
      player.ws.send(
        stringifyMessageData('turn', {
          currentPlayer: this.currentPlayerIndex, 
        })
      )
    })
  }
}
