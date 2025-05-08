import type { Generator } from '../index.js'

export type GenerateLevaOptions = {} | boolean

export function generateLeva(generator: Generator, options: GenerateLevaOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('leva', '^0.10.0')
}
