import { Spinner } from '@/components/ui/spinner'

export function Loading({ text }: { text: string }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="md" className='bg-white' />
        <p className="text-lg text-white">
          {text}
        </p>
      </div>
    </div>
  )
}
