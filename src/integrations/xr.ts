import type { Generator } from '../index.js'

export type GenerateXrOptions = {}

export function generateXr(generator: Generator, options: GenerateXrOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/xr', '^6.6.16')
}
