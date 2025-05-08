import chalk from 'chalk'
import type { Generator } from '../index.js'

export type GeneratePostprocessingOptions = {}

export function generatePostprocessing(generator: Generator, options: GeneratePostprocessingOptions | undefined) {
  if (options == null) {
    return
  }
  if (generator.options.xr != null) {
    console.info(chalk.blue('Info:'), '@react-three/postprocessing is disabled because it is not supported with XR')
    return
  }
  generator.addDependency('@react-three/postprocessing', '^3.0.4')
}
