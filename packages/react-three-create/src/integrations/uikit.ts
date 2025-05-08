import type { Generator } from '../index.js'

export type GenerateUikitOptions = {} | boolean

export function generateUikit(generator: Generator, options: GenerateUikitOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/uikit', '^0.8.15')
}
