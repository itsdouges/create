import type { Generator } from '../index.js'

export type GenerateZustandOptions = {}

export function generateZustand(generator: Generator, options: GenerateZustandOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('zustand', '^5.0.3')
}
