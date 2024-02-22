import Game from './Game'
import Player from './Player'

export default class GameManager {
  private _games: Map<string, Game> = new Map()

  constructor(private _gameStore: Set<Player>) {
    this._gameStore = _gameStore
  }

  public get games() {
    return this._games
  }

  public getWinnersData(players: Set<Player>) {
    const winnersData = [...players]
      .filter((player) => player.wins > 0)
      .map((player) => ({
        name: player.name,
        wins: player.wins,
      }))
      .sort((a, b) => b.wins - a.wins)
    return winnersData
  }
}
