import { createRoot } from 'react-dom/client'
import './global.css'
import { App } from './app.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <div className={` bg-black text-white antialiased`}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
  </div>,
)
