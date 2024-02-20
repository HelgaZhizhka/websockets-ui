import { WebSocket } from 'ws'

import Player from './Player'

export default class PlayerManager {
  constructor(private _gameStore: Set<Player>) {
    this._gameStore = _gameStore
  }

  public registerPlayer(name: string, password: string, ws: WebSocket): Player {
    const newPlayer = new Player(name, password, ws)
    newPlayer.isExistingPlayer(this._gameStore)
    return newPlayer
  }

  public getWinnersData() {
    const winnersData = [...this._gameStore]
      .filter((player) => player.wins > 0)
      .map((player) => ({
        name: player.name,
        wins: player.wins,
      }))
      .sort((a, b) => b.wins - a.wins)
    return winnersData
  }
}
