import { WebSocket } from 'ws'

import Player from './Player'

export default class PlayerManager {
  constructor(private _playerStore: Set<Player>) {
    this._playerStore = _playerStore
  }

  public registerPlayer(name: string, password: string, ws: WebSocket): Player {
    const newPlayer = new Player(name, password, ws)
    newPlayer.isExistingPlayer(this._playerStore)
    return newPlayer
  }

  public getWinnersData() {
    const winnersData = [...this._playerStore]
      .filter((player) => player.wins > 0)
      .map((player) => ({
        name: player.name,
        wins: player.wins,
      }))
      .sort((a, b) => b.wins - a.wins)
      console.log(winnersData)
    return winnersData
  }
}
