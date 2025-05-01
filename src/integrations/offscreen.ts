import type { Generator } from '../index.js'

export type GenerateOffscreenOptions = {}

export function generateOffscreen(generator: Generator, options: GenerateOffscreenOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/offscreen', '^0.0.8')
}
