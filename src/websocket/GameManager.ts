import { stringifyMessageData } from '../utils/helpers'
import Game from './Game'
import Player from './Player'

export default class GameManager {
  private _games: Map<string, Game> = new Map()

  constructor(private _playerStore: Set<Player>) {
    this._playerStore = _playerStore
  }

  public get games() {
    return this._games
  }

  public createGame(game: Game) {
    this._games.set(game.idGame, game)
    return game
  }

  public updateWinners() {
    const winnersData = [...this._playerStore]
      .filter((player) => player.wins > 0)
      .map((player) => ({
        name: player.name,
        wins: player.wins,
      }))
      .sort((a, b) => b.wins - a.wins)

    this._playerStore.forEach((player) => {
      player.ws.send(stringifyMessageData('update_winners', winnersData))
    })
  }
}
