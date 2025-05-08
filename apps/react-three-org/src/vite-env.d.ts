/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string
  readonly VITE_REDIRECT_URI: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 