import { WebSocket } from 'ws'

import { generateUniqueId } from '../utils/helpers'
import { Ship } from '../utils/interfaces'
import { USER_EXISTS } from '../utils/constants'

export default class Player {
  public id: string
  public name: string
  public password: string
  public error: boolean = false
  public errorText: string = ''
  public wins: number = 0
  public shipsCount: number = 0
  public ships?: Ship[] = []
  public ws: WebSocket
  public isReady: boolean = false

  constructor(name: string, password: string, ws: WebSocket) {
    this.id = generateUniqueId()
    this.name = name
    this.password = password
    this.ws = ws
  }

  public getPlayerData() {
    return {
      index: this.id,
      name: this.name,
      error: this.error,
      errorText: this.errorText,
    }
  }

  public isExistingPlayer(players: Set<Player>) {
    const existingPlayer = [...players].find(
      (player) => player.name === this.name
    )

    if (existingPlayer) {
      if (existingPlayer.password === this.password) {
        this.id = existingPlayer.id
        this.wins = existingPlayer.wins
        existingPlayer.ws = this.ws
        this.error = false
        this.errorText = ''
      } else {
        this.error = true
        this.errorText = USER_EXISTS
      }
    }
  }
}
