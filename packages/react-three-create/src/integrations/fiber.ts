import type { Generator } from '../index.js'

export type GenerateFiberOptions = {
  /**
   * @default true
   */
  addExample?: boolean
} | boolean

export function generateFiber(generator: Generator, options: GenerateFiberOptions | undefined) {
  //TODO: add default example if addExample is set
}
