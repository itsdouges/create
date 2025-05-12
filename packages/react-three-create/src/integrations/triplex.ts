import type { Generator } from '../index.js'

export type GenerateTriplexOptions = {} | boolean

export function generateTriplex(generator: Generator, options: GenerateTriplexOptions | undefined) {
  if (options == null) {
    return
  }

  generator.inject('vscode-extension-suggestion', 'trytriplex.triplex-vsce')
}
