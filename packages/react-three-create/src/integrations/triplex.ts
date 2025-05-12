import type { Generator } from '../index.js'

export type GenerateTriplexOptions = {} | boolean

export type PropValue = {
  declaredPropName: string
  declaredPropDefaultValue: unknown
  propName: string
  propValue: string
}

export type ProviderDefinition = Record<
  string,
  | {
      component: string
      type: 'takes-children'
      import: string
      props?: PropValue[]
    }
  | {
      code: string
      type: 'inline'
      import: string
      props?: PropValue[]
    }
>

function generateProvidersModule(generator: Generator): string {
  const canvasProviders: (keyof typeof providerDefs)[] = []
  const globalProviders: (keyof typeof providerDefs)[] = []
  const providerDefs = {
    rapier: {
      component: 'Physics',
      type: 'takes-children',
      import: 'import { Physics } from "@react-three/rapier";',
      props: [
        {
          declaredPropDefaultValue: false,
          declaredPropName: 'physicsEnabled',
          propName: 'paused',
          propValue: '!physicsEnabled',
        },
        {
          declaredPropDefaultValue: true,
          declaredPropName: 'debugPhysics',
          propName: 'debug',
          propValue: 'debugPhysics',
        },
      ],
    },
    postprocessing: {
      type: 'inline',
      code: `
        <EffectComposer enabled={postProcessingEnabled}>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      `,
      import: 'import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";',
      props: [
        {
          declaredPropDefaultValue: true,
          declaredPropName: 'postProcessingEnabled',
          propName: 'enabled',
          propValue: 'postProcessingEnabled',
        },
      ],
    },
  } satisfies ProviderDefinition

  if (!!generator.options.rapier) {
    canvasProviders.push('rapier')
  }

  if (!!generator.options.postprocessing) {
    canvasProviders.push('postprocessing')
  }

  function generateProviderFunction(
    name: string,
    { jsdoc, providers }: { jsdoc: string; providers: (keyof typeof providerDefs)[] },
  ) {
    const resolvedProviders = providers.map((provider) => providerDefs[provider])
    const providerProps = resolvedProviders.flatMap((provider) => provider.props)
    const providerImports = resolvedProviders.flatMap((provider) => provider.import)
    const wrappedComponents = resolvedProviders.filter((provider) => provider.type === 'takes-children')
    const inlineComponents = resolvedProviders.filter((provider) => provider.type === 'inline')
    const declaredProps = providerProps
      .map((prop) => `${prop.declaredPropName} = ${prop.declaredPropDefaultValue}`)
      .join(', ')
    const declaredTypes = providerProps
      .map((prop) => `${prop.declaredPropName}?: ${typeof prop.declaredPropDefaultValue}`)
      .join('; ')

    return {
      imports: providerImports,
      code: `
      /**
${jsdoc
  .split('\n')
  .map((line) => `       * ${line}`)
  .join('\n')}
       */
      export function ${name}({ children, ${declaredProps} }: { children: React.ReactNode; ${declaredTypes} }) {
        return (
          <>
            ${inlineComponents.map((provider) => provider.code)}
            ${wrappedComponents.reduce((acc, provider) => {
              const props = provider.props.map((prop) => `${prop.propName}={${prop.propValue}}`).join(' ')
              return `<${provider.component} ${props}>${acc}</${provider.component}>`
            }, '{children}')}
          </>
        );
      }`,
    }
  }

  const global = generateProviderFunction('GlobalProvider', {
    jsdoc:
      'The global provider is rendered at the root of your application,\nuse it to set up global configuration like themes.\nProps defined on this component appear as controls inside Triplex.\n\nSee: https://triplex.dev/docs/building-your-scene/providers#global-provider',
    providers: globalProviders,
  })
  const canvas = generateProviderFunction('CanvasProvider', {
    jsdoc:
      'The canvas provider is rendered as a child inside the React Three Fiber canvas,\nuse it to set up canvas specific configuration like post-processing and physics.\nProps defined on this component appear as controls inside Triplex.\n\nSee: https://triplex.dev/docs/building-your-scene/providers#canvas-provider',
    providers: canvasProviders,
  })

  return `
    ${global.imports.concat(canvas.imports).sort().join('\n')}
    
    ${global.code}
    ${canvas.code}
  `
}

export function generateTriplex(generator: Generator, options: GenerateTriplexOptions | undefined) {
  if (options == null) {
    return
  }

  generator.inject('vscode-extension-suggestion', 'trytriplex.triplex-vsce')
  generator.inject(
    'readme-tools',
    '[Triplex](https://triplex.dev) - Build the 2D and 3D web without coding. Your visual workspace for React / Three Fiber.',
  )

  generator.addFile('.triplex/providers.tsx', {
    content: generateProvidersModule(generator),
    type: 'text',
  })

  generator.addFile('.triplex/config.json', {
    content: JSON.stringify(
      {
        $schema: 'https://triplex.dev/config.schema.json',
        provider: './providers.tsx',
      },
      null,
      2,
    ),
    type: 'text',
  })
}
