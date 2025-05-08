import { generate } from '@react-three/create'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { upload } from './upload.js'
import { OAuthApp } from '@octokit/oauth-app'

const oauthApp = new OAuthApp({
  clientType: 'oauth-app',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
})

const server = Fastify()

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Define the response schema
const GenerateOptionsSchema = z.object({
  name: z.string().optional(),
  language: z.enum(['javascript', 'typescript']).optional(),
  handle: z.boolean().optional(),
  drei: z.boolean().optional(),
  koota: z.boolean().optional(),
  leva: z.boolean().optional(),
  offscreen: z.boolean().optional(),
  postprocessing: z.boolean().optional(),
  rapier: z.boolean().optional(),
  uikit: z.boolean().optional(),
  xr: z.boolean().optional(),
  zustand: z.boolean().optional(),
})

server.withTypeProvider<ZodTypeProvider>().get(
  '/',
  {
    schema: {
      querystring: z.object({
        state: z.string(),
        code: z.string(),
      }),
    },
  },
  async (request, response) => {
    const { code, state } = request.query
    const { authentication } = await oauthApp.createToken({ code })
    const parsedResult = GenerateOptionsSchema.safeParse(JSON.parse(atob(decodeURIComponent(state))))
    if (parsedResult.success === false) {
      return response.status(400).send({
        error: 'Invalid request parameters',
        details: parsedResult.error.format(),
      })
    }
    const name = parsedResult.data.name ?? `react-three-${generateRandomName()}`
    const files = generate({ name, ...parsedResult.data })
    const url = await upload(name, files, authentication.token)
    return response.redirect(url)
  },
)

/**
 * Generates a random name in the format "adjective-noun"
 * @returns A randomly generated name string
 */
function generateRandomName(): string {
  const adjectives = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'black',
    'white',
    'tiny',
    'big',
    'small',
    'large',
    'huge',
    'giant',
    'mini',
    'mega',
    'super',
    'happy',
    'sad',
    'angry',
    'calm',
    'quiet',
    'loud',
    'silent',
    'noisy',
    'shiny',
    'dull',
    'bright',
    'dark',
    'fuzzy',
    'smooth',
    'rough',
    'soft',
  ]

  const nouns = [
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
    'honeydew',
    'cat',
    'dog',
    'elephant',
    'fox',
    'giraffe',
    'horse',
    'iguana',
    'jaguar',
    'mountain',
    'river',
    'ocean',
    'desert',
    'forest',
    'jungle',
    'meadow',
    'valley',
    'star',
    'moon',
    'sun',
    'planet',
    'comet',
    'asteroid',
    'galaxy',
    'universe',
  ]

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${randomAdjective}-${randomNoun}`
}

const start = async () => {
  try {
    await server.listen({ port: 8080, host: '0.0.0.0' })
    console.log('Server is running on http://localhost:8080')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
