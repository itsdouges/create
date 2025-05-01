import { GitAttributes, HtmlContent, IndexContent } from './constants.js'
import { GenerateDreiOptions, generateDrei } from './integrations/drei.js'
import { generateKoota, GenerateKootaOptions } from './integrations/koota.js'
import { generateLeva, GenerateLevaOptions } from './integrations/leva.js'
import { generateOffscreen, GenerateOffscreenOptions } from './integrations/offscreen.js'
import { generatePostprocessing, GeneratePostprocessingOptions } from './integrations/postprocessing.js'
import { generateRapier, GenerateRapierOptions } from './integrations/rapier.js'
import { generateUikit, GenerateUikitOptions } from './integrations/uikit.js'
import { generateXr, GenerateXrOptions } from './integrations/xr.js'
import { generateZustand, GenerateZustandOptions } from './integrations/zustand.js'

export type GenerateOptions = {
  name?: string
  language?: 'javascript' | 'typescript'
  drei?: GenerateDreiOptions
  koota?: GenerateKootaOptions
  leva?: GenerateLevaOptions
  offscreen?: GenerateOffscreenOptions
  postprocessing?: GeneratePostprocessingOptions
  rapier?: GenerateRapierOptions
  uikit?: GenerateUikitOptions
  xr?: GenerateXrOptions
  zustand?: GenerateZustandOptions
  dependencies?: Record<string, string>
  files?: Record<string, File>
  injections?: Array<{ location: CodeInjectionLocation; code: string }>
  replacements?: Array<{ search: string; replace: string }>
}

export type File =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'remote'
      url: string
    }

export type CodeInjectionLocation =
  | 'import'
  | 'global-start'
  | 'global-end'
  | 'dom-start'
  | 'dom'
  | 'dom-end'
  | 'scene-start'
  | 'scene'
  | 'scene-end'

export type Generator = {
  addDependency(name: string, semver: string): void
  addFile(path: string, file: File): void
  inject(location: CodeInjectionLocation, code: string): void
  replace(search: string, replace: string): void
}

export function generate(options: GenerateOptions) {
  const files: Record<string, File> = {
    ...options.files,
  }
  const replacements: Array<{ search: string; replace: string }> = options.replacements ?? []
  const dependencies: Record<string, string> = {
    three: '~0.175.0',
    '@react-three/fiber': '^9.0.0',
    'react-dom': '^19.0.0',
    react: '^19.0.0',
    vite: '^6.3.4',
    ...options.dependencies,
  }
  if (options.language === 'typescript') {
    files['tsconfig.json'] = {
      type: 'text',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          esModuleInterop: true,
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          outDir: 'dist',
        },
        include: ['src/**/*'],
      }),
    }
    dependencies['@types/three'] = '~0.175.0'
    dependencies['@types/react-dom'] = '^19.0.0'
    dependencies['@types/react'] = '^19.0.0'
  }
  const codeSnippets: Partial<Record<CodeInjectionLocation, Array<string>>> = {
    import: [`import { Canvas } from "@react-three/fiber"`]
  }
  const generator: Generator = {
    addDependency(name, semver) {
      const existingSemver = dependencies[name]
      if (existingSemver != null) {
        //TODO: intersect existingSemver with semver and write to semver
        //TODO: throw error if no overlap
      }
      dependencies[name] = semver
    },
    addFile(path, content) {
      files[path] = content
    },
    inject(location, code) {
      let entries = codeSnippets[location]
      if (entries == null) {
        codeSnippets[location] = entries = []
      }
      entries.push(code)
    },
    replace(search, replace) {
      replacements.push({ search, replace })
    },
  }
  generateDrei(generator, options.drei)
  generateKoota(generator, options.koota)
  generateLeva(generator, options.leva)
  generateOffscreen(generator, options.offscreen)
  generatePostprocessing(generator, options.postprocessing)
  generateRapier(generator, options.rapier)
  generateUikit(generator, options.uikit)
  generateXr(generator, options.xr)
  generateZustand(generator, options.zustand)

  for (const { code, location } of options.injections ?? []) {
    generator.inject(location, code)
  }

  //TODO: add vite.config.js with react plugin
  //TODO: add triplex recommendation
  //TODO: add option to setup workflow for publishing to github pages

  const name = options.name ?? 'react-three-app'

  files['package.json'] = {
    type: 'text',
    content: JSON.stringify({
      name,
      type: 'module',
      dependencies,
      scripts: {
        dev: 'vite',
        build: 'vite build',
      },
    }),
  }
  files['.gitignore'] = { type: 'text', content: ['node_modules', 'dist'].join('\n') }
  files['.gitattributes'] = { type: 'text', content: GitAttributes }
  files[`src/index.tsx`] = { type: 'text', content: IndexContent }

  codeSnippets['dom-end']?.reverse()
  codeSnippets['global-end']?.reverse()
  codeSnippets['scene-end']?.reverse()
  let appCode = [
    ...(codeSnippets['import'] ?? []),
    ...(codeSnippets['global-start'] ?? []),
    `export function App() {`,
    ' return <>',
    ...(codeSnippets['dom-start'] ?? []),
    ...(codeSnippets['dom'] ?? []),
    '   <Canvas>',
    ...(codeSnippets['scene-start'] ?? []),
    ...(codeSnippets['scene'] ?? []),
    ...(codeSnippets['scene-end'] ?? []),
    '   </Canvas>',
    ...(codeSnippets['dom-end'] ?? []),
    ' </>',
    '}',
    ...(codeSnippets['global-end'] ?? []),
  ].join('\n')
  const indexHtml = HtmlContent.replace(
    '$indexPath',
    options.language === 'javascript' ? './src/index.jsx' : './src/index.tsx',
  ).replace('$title', name)

  for (const { search, replace } of replacements) {
    appCode = appCode.replace(search, replace)
  }
  files[`src/app.tsx`] = { type: 'text', content: appCode }
  files[`index.html`] = { type: 'text', content: indexHtml }

  if (options.language === 'javascript') {
    //TODO: transpile tsx? to jsx? files}
  }
  //TODO: execute prettier on ts(x), js(x), and json files``

  return files
}
