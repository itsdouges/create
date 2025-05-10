import { Octokit } from '@octokit/rest'
import { File } from '@react-three/create'
import { init, commit, push, add } from 'isomorphic-git'
import { mkdir, writeFile } from '@zenfs/core/promises'
import { configureSingle, fs, InMemory } from '@zenfs/core'
import { dirname } from 'path'
import http from 'isomorphic-git/http/node/index.js'

await configureSingle({ backend: InMemory })

export async function upload(octokit: Octokit, name: string, username: string, files: Record<string, File>, token: string) {

  const response = await octokit.repos.createForAuthenticatedUser({
    name,
    description: 'react-three app created using react-three.org',
    private: false,
    auto_init: false,
  })

  await octokit.repos.updateInformationAboutPagesSite({
    owner: username!,
    repo: name,
    build_type: 'workflow',
  }).catch(console.error)

  const filePaths = Object.keys(files).sort()

  for (const filePath of filePaths) {
    await mkdir(dirname(filePath), { recursive: true })
    const file = files[filePath]!

    if (file.type === 'text') {
      await writeFile(filePath, file.content)
    } else {
      const response = await fetch(file.url)
      await writeFile(filePath, await response.bytes())
    }
  }

  await init({ fs, dir: '/', defaultBranch: 'main' })

  await add({ fs, dir: '/', filepath: filePaths })

  await commit({ fs, dir: '/', message: 'initial commit', author: { name: username! } })

  await push({
    fs,
    dir: '/',
    url: response.data.html_url,
    http,
    onAuth: () => ({ username: username!, password: token }),
  }).catch(console.error)

  return response.data.html_url
}
