import type { Generator } from '../index.js'

export type GenerateTriplexOptions = {} | boolean

export function generateTriplex(generator: Generator, options: GenerateTriplexOptions | undefined) {
  if (options == null) {
    return
  }

  generator.inject('vscode-extension-suggestion', 'trytriplex.triplex-vsce')
  generator.inject(
    'readme-tools',
    '[Triplex](https://triplex.dev) - Build the 2D and 3D web without coding. Your visual workspace for React / Three Fiber.',
  )
}
