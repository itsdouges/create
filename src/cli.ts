#!/usr/bin/env node
import { cwd } from 'process'
import { generate, GenerateOptions } from './index.js'
import { dirname, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { Command } from 'commander'
import prompts, { PromptObject } from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import { fetch } from 'undici'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function loadOptionsFromUrl(url: string): Promise<GenerateOptions> {
  const spinner = ora('Loading template from URL...').start()
  try {
    const response = await fetch(url)
    const options = await response.json()
    spinner.succeed('Create options loaded successfully')
    return options as any
  } catch (error) {
    spinner.fail('Failed to load template')
    throw error
  }
}

async function promptForOptions(name: string | undefined): Promise<GenerateOptions> {
  let cancelled = false
  if (name == null) {
    name = (
      await prompts(
        {
          type: 'text',
          name: 'name',
          message: 'What is your project named?',
          initial: 'react-three-app',
          validate: (name: string) => (name.length > 0 ? true : 'Project name is required'),
        },
        {
          onCancel: () => {
            cancelled = true
            return false
          },
        },
      )
    ).name
  }

  if (cancelled) {
    return Promise.reject(`Input cancelled`)
  }

  const questions = [
    {
      type: 'select',
      name: 'language' as const,
      message: 'Which language would you like to use?',
      choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
      ],
      initial: 0,
    },
    {
      type: 'multiselect',
      name: 'integrations' as const,
      message: 'Which integrations would you like to include?',
      choices: [
        { title: 'Drei', value: 'drei', selected: true },
        { title: 'Handle', value: 'handle', selected: true },
        { title: 'Leva', value: 'leva', selected: true },
        { title: 'Postprocessing', value: 'postprocessing', selected: true },
        { title: 'Rapier', value: 'rapier', selected: true },
        { title: 'XR', value: 'xr', selected: true },
        { title: 'UIKit', value: 'uikit', selected: true },
        { title: 'Offscreen', value: 'offscreen', selected: true },
        { title: 'Zustand', value: 'zustand', selected: true },
        { title: 'Koota', value: 'koota', selected: true },
      ],
    },
  ] satisfies Array<PromptObject>

  const answers = await prompts(questions, {
    onCancel: () => {
      cancelled = true
      return false
    },
  })

  if (cancelled) {
    return Promise.reject(`Input cancelled`)
  }

  return {
    name,
    language: answers.language,
    drei: answers.integrations?.includes('drei') ? {} : undefined,
    handle: answers.integrations?.includes('handle') ? {} : undefined,
    leva: answers.integrations?.includes('leva') ? {} : undefined,
    postprocessing: answers.integrations?.includes('postprocessing') ? {} : undefined,
    rapier: answers.integrations?.includes('rapier') ? {} : undefined,
    xr: answers.integrations?.includes('xr') ? {} : undefined,
    uikit: answers.integrations?.includes('uikit') ? {} : undefined,
    offscreen: answers.integrations?.includes('offscreen') ? {} : undefined,
    zustand: answers.integrations?.includes('zustand') ? {} : undefined,
    koota: answers.integrations?.includes('koota') ? {} : undefined,
  }
}

interface CliOptions {
  url?: string
  js?: boolean
  ts?: boolean
  drei?: boolean
  handle?: boolean
  leva?: boolean
  postprocessing?: boolean
  rapier?: boolean
  xr?: boolean
  uikit?: boolean
  offscreen?: boolean
  zustand?: boolean
  koota?: boolean
  yes?: boolean
}

async function main() {
  const program = new Command()
    .name('Create React Three')
    .description('Official CLI for creating React Three Fiber projects')
    .argument('[name]', 'name for the app')
    .option('--url <url>', 'URL to the create options from')
    .option('--js', 'use javascript')
    .option('--ts', 'use typescript (default)')
    .option('--drei', 'add @react-three/drei')
    .option('--handle', 'add @react-three/handle')
    .option('--leva', 'add leva')
    .option('--postprocessing', 'add @react-three/postprocessing')
    .option('--rapier', 'add @react-three/rapier')
    .option('--xr', 'add @react-three/xr')
    .option('--uikit', 'add @react-three/uikit')
    .option('--offscreen', 'add @react-three/offscreen')
    .option('--zustand', 'add zustand')
    .option('--koota', 'add koota')
    .option('-y, --yes', 'Skip prompts and use default values')
    .action(async (name: string | undefined, options: CliOptions) => {
      let generateOptions: GenerateOptions

      if (options.url) {
        generateOptions = await loadOptionsFromUrl(options.url)
        generateOptions.name = name ?? generateOptions.name
      } else if (Object.keys(options).length > 0) {
        generateOptions = {
          name,
          language: options.js ? 'javascript' : 'typescript',
          drei: options.drei ? {} : undefined,
          handle: options.handle ? {} : undefined,
          leva: options.leva ? {} : undefined,
          postprocessing: options.postprocessing ? {} : undefined,
          rapier: options.rapier ? {} : undefined,
          xr: options.xr ? {} : undefined,
          uikit: options.uikit ? {} : undefined,
          offscreen: options.offscreen ? {} : undefined,
          zustand: options.zustand ? {} : undefined,
          koota: options.koota ? {} : undefined,
        }
      } else {
        generateOptions = await promptForOptions(name)
      }

      generateOptions.name ??= 'react-three-app'

      const basePath = join(cwd(), generateOptions.name)
      const spinner = ora('Generating project structure...').start()

      try {
        const files = generate(generateOptions)
        const filePaths = Object.keys(files).sort()

        for (const filePath of filePaths) {
          const fullFilePath = join(basePath, filePath)
          await mkdir(dirname(fullFilePath), { recursive: true })
          const file = files[filePath]

          if (file.type === 'text') {
            await writeFile(fullFilePath, file.content)
          } else {
            const response = await fetch(file.url)
            await writeFile(fullFilePath, response.body!)
          }
        }

        spinner.succeed('Project created successfully!')

        console.log(chalk.green('\nNext steps:'))
        console.log(chalk.cyan(`  cd ${generateOptions.name}`))
        console.log(chalk.cyan('  npm install'))
        console.log(chalk.cyan('  npm run dev\n'))
      } catch (error) {
        spinner.fail('Failed to create project')
        console.error(error)
        process.exit(1)
      }
    })

  await program.parseAsync()
}

main().catch(console.error)
