import { describe, it, expect, vi } from 'vitest'
import { generateTriplex } from '../triplex'

describe('triplex integration', () => {
  it('should generate empty providers', () => {
    const addFile = vi.fn()

    generateTriplex(
      {
        configureVite: vi.fn(),
        options: {},
        replace: vi.fn(),
        addDependency: vi.fn(),
        addFile,
        inject: vi.fn(),
      },
      {},
    )

    expect(addFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        ".triplex/providers.tsx",
        {
          "content": "
          
          
          
            /**
             * The global provider is rendered at the root of your application,
             * use it to set up global configuration like themes.
             * Props defined on this component appear as controls inside Triplex.
             * 
             * See: https://triplex.dev/docs/building-your-scene/providers#global-provider
             */
            export function GlobalProvider({ children,  }: { children: React.ReactNode;  }) {
              return (
                <>
                  
                  {children}
                </>
              );
            }
          
            /**
             * The canvas provider is rendered as a child inside the React Three Fiber canvas,
             * use it to set up canvas specific configuration like post-processing and physics.
             * Props defined on this component appear as controls inside Triplex.
             * 
             * See: https://triplex.dev/docs/building-your-scene/providers#canvas-provider
             */
            export function CanvasProvider({ children,  }: { children: React.ReactNode;  }) {
              return (
                <>
                  
                  {children}
                </>
              );
            }
        ",
          "type": "text",
        },
      ]
    `)
  })

  it('should generate populated providers', () => {
    const addFile = vi.fn()

    generateTriplex(
      {
        configureVite: vi.fn(),
        options: { postprocessing: true, rapier: true },
        replace: vi.fn(),
        addDependency: vi.fn(),
        addFile,
        inject: vi.fn(),
      },
      {},
    )

    expect(addFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        ".triplex/providers.tsx",
        {
          "content": "
          import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
      import { Physics } from "@react-three/rapier";
          
          
            /**
             * The global provider is rendered at the root of your application,
             * use it to set up global configuration like themes.
             * Props defined on this component appear as controls inside Triplex.
             * 
             * See: https://triplex.dev/docs/building-your-scene/providers#global-provider
             */
            export function GlobalProvider({ children,  }: { children: React.ReactNode;  }) {
              return (
                <>
                  
                  {children}
                </>
              );
            }
          
            /**
             * The canvas provider is rendered as a child inside the React Three Fiber canvas,
             * use it to set up canvas specific configuration like post-processing and physics.
             * Props defined on this component appear as controls inside Triplex.
             * 
             * See: https://triplex.dev/docs/building-your-scene/providers#canvas-provider
             */
            export function CanvasProvider({ children, physicsEnabled = false, debugPhysics = true, postProcessingEnabled = true }: { children: React.ReactNode; physicsEnabled?: boolean; debugPhysics?: boolean; postProcessingEnabled?: boolean }) {
              return (
                <>
                  
              <EffectComposer enabled={postProcessingEnabled}>
                <DepthOfField
                  focusDistance={0}
                  focalLength={0.02}
                  bokehScale={2}
                  height={480}
                />
                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
              </EffectComposer>
            
                  <Physics paused={!physicsEnabled} debug={debugPhysics}>{children}</Physics>
                </>
              );
            }
        ",
          "type": "text",
        },
      ]
    `)
  })

  it('should inject extension suggestion and readme', () => {
    const inject = vi.fn()

    generateTriplex(
      {
        configureVite: vi.fn(),
        options: {},
        replace: vi.fn(),
        addDependency: vi.fn(),
        addFile: vi.fn(),
        inject,
      },
      {},
    )

    expect(inject.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "vscode-extension-suggestion",
          "trytriplex.triplex-vsce",
        ],
        [
          "readme-tools",
          "[Triplex](https://triplex.dev) - Build the 2D and 3D web without coding. Your visual workspace for React / Three Fiber.",
        ],
      ]
    `)
  })

  it('should add config file', () => {
    const addFile = vi.fn()

    generateTriplex(
      {
        configureVite: vi.fn(),
        options: {},
        replace: vi.fn(),
        addDependency: vi.fn(),
        addFile,
        inject: vi.fn(),
      },
      {},
    )

    expect(addFile.mock.calls[1]).toMatchInlineSnapshot(`
      [
        ".triplex/config.json",
        {
          "content": "{
        "$schema": "https://triplex.dev/config.schema.json",
        "provider": "./providers.tsx"
      }",
          "type": "text",
        },
      ]
    `)
  })
})
