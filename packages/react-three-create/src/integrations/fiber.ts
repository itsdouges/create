import type { Generator } from '../index.js'

export type GenerateFiberOptions =
  | {
      /**
       * @default true
       */
      addExample?: boolean
    }
  | boolean

export function generateFiber(generator: Generator, options: GenerateFiberOptions | undefined) {
  generator.inject("import", `import { Box } from "./box.js"`)
  generator.inject(
    'scene',
    [
      `<ambientLight intensity={Math.PI / 2} />`,
      `<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />`,
      `<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />`,
      `<Box position={[-1.2, 0, 0]} />`,
      `<Box position={[1.2, 0, 0]} />`,
    ].join('\n'),
  )

  generator.addFile('src/box.tsx', {
    type: 'text',
    content: `import type { Mesh } from 'three'
import { useRef, useState } from 'react'
import { useFrame, ThreeElements } from '@react-three/fiber'

export function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  )
}`,
  })
}
