import dbConnector from "./_dbConnector.ts"

export interface BootlegSchema {
    _id: { $oid: string }
    title: string
    description: string
}

export const bootlegsCollection = dbConnector.collection<BootlegSchema>("bootlegs")