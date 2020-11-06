import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"
import BaseFixture from "./_base.fixture.ts"

class BootlegFixture extends BaseFixture {
    constructor() {
        super()
    }

    getItem() {
        return {
            title: faker.commerce.productName(),
            description: faker.company.catchPhraseDescriptor(),
            date: faker.date.past(),
            picture: faker.image.imageUrl(),
            links: [faker.internet.url()],
            bands: [faker.internet.userName()],
            songs: [faker.internet.userName(), faker.internet.userName(), faker.internet.userName()],
            countries: [faker.address.country()],
            cities: ["France"],
            isCompleteShow: faker.random.boolean(),
            isAudioOnly: faker.random.boolean(),
            isProRecord: faker.random.boolean(),
            soundQuality: faker.random.number({ min: 1, max: 10 }),
            videoQuality: faker.random.number({ min: 1, max: 10 }),
            state: faker.random.number({ min: 0, max: 1 })
        }
    }

    async load() {
        const userIds = await (await this.usersCollection.find({}, { _id: 1 } as any)).map(x => x._id)

        await this.bootlegsCollection.insertMany([
            ...new Array(50).fill({}).map((x: any) => ({
                ...this.getItem(),
                state: faker.random.number({ min: 1, max: 2 }),
                createdById: faker.random.arrayElement(userIds),
                createdOn: new Date(),
                modifiedById: faker.random.arrayElement(userIds),
                modifiedOn: new Date()
            })),
            {
                ...this.getItem(),
                bands: ['myband'],
                songs: ['mysong'],
                state: faker.random.number({ min: 1, max: 2 }),
                createdById: faker.random.arrayElement(userIds),
                createdOn: new Date(),
                modifiedById: faker.random.arrayElement(userIds),
                modifiedOn: new Date()
            }
        ])
    }

    async unload() {
        await this.bootlegsCollection.deleteMany({})
    }
}

export default new BootlegFixture()