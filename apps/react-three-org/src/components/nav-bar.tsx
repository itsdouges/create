import { Button } from "@/components/ui/button"
import { GithubIcon, BookOpen, Twitter, MessageSquare } from "lucide-react"

export function NavBar() {
  return (
    <nav className="grid grid-cols-2 sm:grid-cols-4 justify-center gap-3 py-2 px-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10">
      <a href="https://github.com/pmndrs/react-three-fiber" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-base" aria-label="Visit React Three Fiber GitHub repository">
          <GithubIcon className="h-5 w-5" />
          <span>GitHub</span>
        </Button>
      </a>
      <a href="https://docs.pmnd.rs/react-three-fiber" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-base" aria-label="View React Three Fiber documentation">
          <BookOpen className="h-5 w-5" />
          <span>Docs</span>
        </Button>
      </a>
      <a href="https://twitter.com/pmndrs" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-base" aria-label="Follow React Three on Twitter">
          <Twitter className="h-5 w-5" />
          <span>Twitter</span>
        </Button>
      </a>
      <a href="https://discord.gg/poimandres" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-base" aria-label="Join React Three Discord community">
          <MessageSquare className="h-5 w-5" />
          <span>Discord</span>
        </Button>
      </a>
    </nav>
  )
}
