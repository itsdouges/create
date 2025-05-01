import type { Generator } from '../index.js'

export type GeneratePostprocessingOptions = {}

export function generatePostprocessing(generator: Generator, options: GeneratePostprocessingOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/postprocessing', '^3.0.4')
}
