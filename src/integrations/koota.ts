import type { Generator } from '../index.js'

export type GenerateKootaOptions = {
  /**
   * @default true
   */
  addExample?: boolean
}

export function generateKoota(generator: Generator, options: GenerateKootaOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('koota', '^0.4.0')
}
