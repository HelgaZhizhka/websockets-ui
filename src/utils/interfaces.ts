export interface Data {
  type: string 
  data: string 
  id: number 
}

export interface Ship {
  type: 'small' | 'medium' | 'large' | 'huge'
  direction: boolean 
  length: number 
  position: {
    x: number
    y: number
  }
}


export interface Attack {
  playerId: string
  gameId: string
  x: number 
  y: number 
}
