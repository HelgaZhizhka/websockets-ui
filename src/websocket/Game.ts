import Player from './Player'

export default class Game {
  idGame: string
  players: Player[]

  constructor(
    private _gameStore: Set<Player>,
    idGame: string,
    ...players: Player[]
  ) {
    this.idGame = idGame
    this.players = players
    this._gameStore = _gameStore
  }
  
}
