import type { Generator } from '../index.js'
import chalk from 'chalk'

export type GenerateOffscreenOptions = {}

export function generateOffscreen(generator: Generator, options: GenerateOffscreenOptions | undefined) {
  if (options == null) {
    return
  }
  if (generator.options.xr != null) {
    console.info(chalk.blue('Info:'), '@react-three/offscreen is disabled because it is not supported with XR')
    return
  }
  generator.addDependency('@react-three/offscreen', '^0.0.8')
}
