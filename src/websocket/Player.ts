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

  public hasPlayer(players: Set<Player>) {
    this.error = [...players].some((player) => player.name === this.name)

    if (this.error) {
      this.errorText = USER_EXISTS
    }
  }
}
