export function App() {
  return (
    <a
      target="_BLANK"
      href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${
        import.meta.env.VITE_REDIRECT_URI
      }&state=${btoa(JSON.stringify({}))}&scope=repo`}
    >
      Deploy to Github
    </a>
  )
}
