import { config } from "https://deno.land/x/dotenv/mod.ts"
import "https://deno.land/x/dotenv/load.ts"

interface IEnv {
    DENO_ENV?: string
    PORT?: string
    HOST?: string
    MONGO_CONNEXION?: string
    MONGO_DB?: string
    JWT_KEY?: string
    GOOGLE_PUBLIC_KEY?: string
    GOOGLE_PRIVATE_KEY?: string
    TWITTER_PUBLIC_KEY?: string
    TWITTER_PRIVATE_KEY?: string
    FACEBOOK_PUBLIC_KEY?: string
    FACEBOOK_PRIVATE_KEY?: string
}

export const env: IEnv = (() => {
    const conf = { ...config({ path: '.env' }), DENO_ENV: Deno.env.get('DENO_ENV') }
    switch (Deno.env.get('DENO_ENV')) {
        case 'test':
            return { ...conf, ...config({ path: '.env.test' }) }
        case 'staging':
            return { ...conf, ...config({ path: '.env.staging' }) }
        case 'prod':
            return { ...conf, ...config({ path: '.env.prod' }) }
        default:
            return conf
    }
})()

