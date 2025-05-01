export const HtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title</title>
</head>
<body style="margin: 0; overscroll-behavior: none; user-select: none; touch-action: none;">
    <script type="module" src="$indexPath"></script>
    <div style="width: 100dvw; height: 100dvh; overflow: hidden;" id="root"></div>
</body>
</html>`

export const IndexContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`

export const GitAttributes = [
  '* text eol=lf',
  '*.png binary',
  '*.jpg binary',
  '*.jpeg binary',
  '*.gif binary',
  '*.ico binary',
  '*.mov binary',
  '*.mp4 binary',
  '*.mp3 binary',
  '*.flv binary',
  '*.fla binary',
  '*.wav binary',
  '*.swf binary',
  '*.gz binary',
  '*.zip binary',
  '*.7z binary',
  '*.ttf binary',
  '*.eot binary',
  '*.woff binary',
  '*.pyc binary',
  '*.pdf binary',
  '*.glb binary',
  '*.gltf binary',
].join('\n')
