import { WebSocket } from 'ws'

import { generateUniqueId } from '../utils/helpers'
import { Ship } from '../utils/interfaces'
import { USER_EXISTS } from '../utils/constants'
import Game from './Game'

export default class Player {
  id: string
  name: string
  password: string
  error: boolean
  errorText: string
  wins: number
  game?: Game
  ships?: Ship[]
  ws: WebSocket

  constructor(name: string, password: string, ws: WebSocket) {
    this.id = generateUniqueId()
    this.name = name
    this.password = password
    this.error = false
    this.errorText = ''
    this.wins = 0

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
