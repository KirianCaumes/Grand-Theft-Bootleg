import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"

/** About Mongo */
const client = new MongoClient();
client.connectWithUri(config()?.MONGO_CONNEXION)
const dbConnector = client.database(config()?.MONGO_DB)

export default dbConnector