import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { env } from "../helpers/config.ts"

export const client = new MongoClient();
client.connectWithUri(env?.MONGO_CONNEXION!)

export const dbConnector = client.database(env?.MONGO_DB!)