import type { Generator } from '../index.js'

export type GenerateDreiOptions = {}

export function generateDrei(generator: Generator, options: GenerateDreiOptions | undefined) {
  if (options == null) {
    return
  }
  generator.addDependency('@react-three/drei', '^10.0.0')
  generator.inject("import", `import { Environment } from "@react-three/drei"`)
  generator.inject("scene", "<Environment background />")
}
