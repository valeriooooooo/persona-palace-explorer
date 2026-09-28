import { kamoshida } from './kamoshida'

// Every Palace shown on the selection screen, in story order.
export const PALACES = [kamoshida]

export const findPalace = (id) => PALACES.find((p) => p.id === id)
