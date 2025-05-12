import { JSX } from 'react'
import { Button } from './ui/button'
import { Package } from '../lib/packages'
import { CheckSquare, X } from 'lucide-react'

interface SelectionSectionProps {
  icon: (props: { className?: string }) => React.ReactNode
  options: Package[]
  value: string[]
  onChange: (value: string[]) => void
  label: string
}

export function SelectionSection({ label, value, onChange, options, icon: Icon }: SelectionSectionProps) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-white/70 flex items-center">
          <Icon className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          Select {label} to include in your project
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs hover:bg-white/5 flex items-center"
          onClick={() => {
            if (options.length === value.length) {
              onChange([])
            } else {
              onChange(options.map((pkg) => pkg.id))
            }
          }}
          aria-label={value.length === options.length ? `Deselect all ${label}` : `Select all ${label}`}
        >
          {value.length === options.length ? (
            <X className="h-3.5 w-3.5 mr-1 opacity-70" />
          ) : (
            <CheckSquare className="h-3.5 w-3.5 mr-1 opacity-70" />
          )}
          {value.length === options.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
    </div>
  )
}
