import { generate } from '@react-three/create'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { upload } from './upload.js'
import { OAuthApp } from '@octokit/oauth-app'
import cors from '@fastify/cors'
import { Octokit } from '@octokit/rest'

const oauthApp = new OAuthApp({
  clientType: 'oauth-app',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
})

const server = Fastify()

await server.register(cors)

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Define the response schema
const GenerateOptionsSchema = z.object({
  token: z.string(),
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
  triplex: z.boolean().optional(),
  zustand: z.boolean().optional(),
})

server
  .withTypeProvider<ZodTypeProvider>()
  .post(
    '/repo',
    {
      schema: {
        body: GenerateOptionsSchema,
      },
    },
    async ({ body: { token, ...options } }) => {
      const name = options.name ?? `react-three-${generateRandomName()}`
      const octokit = new Octokit({ auth: token })
      const {
        data: { login, name: username, email },
      } = await octokit.users.getAuthenticated()
      const files = generate({ name, ...options, githubRepoName: name, githubUserName: login })
      const url = await upload(octokit, name, username!, login, email!, files, token)
      return { url }
    },
  )
  .get(
    '/oauth',
    {
      schema: {
        querystring: z.object({
          code: z.string(),
        }),
      },
    },
    async (request) => {
      const { code } = request.query
      const { authentication } = await oauthApp.createToken({ code })
      return {
        token: authentication.token,
      }
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
