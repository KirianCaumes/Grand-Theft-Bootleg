export default function startupLoader({ hostname, port, secure }: { hostname?: string; port: number; secure: boolean }) {
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`)
}
