import { createProxyMiddleware } from 'http-proxy-middleware'

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    },
}
const apiProxy = createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: false
})

//TODO this might break production
export default function (req, res) {
    apiProxy(req, res, (result) => {
        if (result instanceof Error)
            throw result

        throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`)
    })
}