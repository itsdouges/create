import type { Generator } from '../index.js'

export type GenerateHandleOptions = {} | boolean

export function generateHandle(generator: Generator, options: GenerateHandleOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/handle', '^6.6.16')
}
