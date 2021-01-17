import Exception from "../../types/exceptions/Exception.ts"
import { env } from "./../config.ts"

export default async function getGoogleUser(user: any) {
    if (!user.strategyData)
        throw new Exception('Invalid Google creditentials')

    const payload = await (await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${user.strategyData?.tokenId}`)).json()

    if (payload.aud !== env.GOOGLE_PUBLIC_KEY)
        throw new Exception('Invalid Google creditentials')

    if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss))
        throw new Exception('Invalid Google creditentials')

    if (payload.exp == null) {
        throw new Exception('Invalid Google creditentials')
    } else if (new Date() > new Date(payload.exp * 1000)) {
        throw new Exception('Invalid Google creditentials')
    }

    return {
        email: payload.email,
        name: payload.name
    }
}