import type { Generator } from '../index.js'

export type GenerateRapierOptions = {} | boolean

export function generateRapier(generator: Generator, options: GenerateRapierOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/rapier', '^2.1.0')
}
