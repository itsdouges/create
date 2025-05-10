import { Button } from '@/components/ui/button'
import { GithubIcon, Download, TerminalIcon, CopyIcon } from 'lucide-react'
import { generate } from '@react-three/create'
import JSZip from 'jszip'
import { toast } from 'sonner'

interface ProjectConfiguratorProps {
  selectedPackages: string[]
  createGithubRepo: () => void
}

//TODO: improve loading visualization

export function ProjectConfigurator({ selectedPackages, createGithubRepo }: ProjectConfiguratorProps) {
  const command = `npm create @react-three ${selectedPackages.map((id) => `--${id}`).join(' ')}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command)
      toast.success('Command copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy command')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-3">
      <div className="relative border border-white/30 rounded-lg p-4 bg-black max-w-4xl mx-auto shadow-[0_0_50px_rgba(255,255,255,0.25)]">
        <div className="flex flex-col md:flex-row gap-4 overflow-hidden">
          <div className="flex flex-row gap-2 bg-white/10 border-white/10 border-1 items-center rounded grow shrink basis-0 min-w-0">
            <TerminalIcon className="h-4 w-4 ml-3 shrink-0" />
            <span className="text-white text-left font-mono grow shrink whitespace-nowrap overflow-hidden text-ellipsis">
              {command}
            </span>
            <Button variant="ghost" size="icon" className="shrink-0 hover:bg-white/10" onClick={copyToClipboard}>
              <CopyIcon />
            </Button>
          </div>
          <div className="flex flex-row shrink-0">
            <Button
              variant="ghost"
              className="border-white/30 hover:bg-white/10 bg-black/70"
              onClick={async () => {
                const element = document.createElement('a')
                const options: any = {}
                for (const selectedPackage of selectedPackages) {
                  options[selectedPackage] = true
                }
                const files = generate(options)
                console.log(files)
                const zip = new JSZip()
                // Write each file into the zip
                for (const [path, file] of Object.entries(files)) {
                  const parts = path.split('/').filter(Boolean)

                  let currentFolder = zip
                  // Create nested folders if needed
                  for (let i = 0; i < parts.length - 1; i++) {
                    currentFolder = currentFolder.folder(parts[i]!)!
                  }
                  // Add the file
                  let content: string | Blob
                  if (file.type === 'text') {
                    content = file.content
                  } else {
                    // For remote files, we'll need to fetch them first
                    const response = await fetch(file.url)
                    content = await response.blob()
                  }
                  currentFolder.file(parts[parts.length - 1]!, content)
                }
                const content = await zip.generateAsync({ type: 'blob' })
                element.href = URL.createObjectURL(content)
                element.download = 'react-three-app.zip'
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
              aria-label="Download project files as ZIP"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={createGithubRepo}
              variant="ghost"
              className="border-white/30 hover:bg-white/10 bg-black/70"
              aria-label="Create GitHub repository"
            >
              <GithubIcon className="h-4 w-4 mr-1" />
              Create Repo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
