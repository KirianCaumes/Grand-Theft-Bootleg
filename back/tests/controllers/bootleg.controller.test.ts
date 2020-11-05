import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import bootlegFixture from "../_fixtures/bootleg.fixture.ts"
import userFixture from "../_fixtures/user.fixture.ts"
import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"

/** Load fixtures */
await userFixture.load()
await bootlegFixture.load()

/** About / */
Deno.test(
    "[GET] Bootleg - Search",
    async () => {
        await (await superoak(app))
            .get('/api/bootleg')
            .auth(await userFixture.getToken(), { type: "bearer" })
            .expect("Content-Type", /json/)
            .expect(200)
    }
)
Deno.test(
    "[GET] Bootleg - Search Params",
    async () => {
        await (await superoak(app))
            .get('/api/bootleg')
            .auth(await userFixture.getToken(), { type: "bearer" })
            .expect("Content-Type", /json/)
            .expect(200)
    }
)
Deno.test(
    "[POST] Bootleg - Create fail",
    async () => {
        await (await superoak(app))
            .post('/api/bootleg')
            .auth(await userFixture.getToken(), { type: "bearer" })
            .send({
                "toto": "tata"
            })
            .expect("Content-Type", /json/)
            .expect(400)
    }
)
Deno.test(
    "[POST] Bootleg - Create success",
    async () => {
        await (await superoak(app))
            .post('/api/bootleg')
            .auth(await userFixture.getToken(), { type: "bearer" })
            .send({
                title: faker.commerce.productName(),
                description: faker.company.catchPhraseDescriptor(),
                date: faker.date.past(),
                picture: faker.image.imageUrl(),
                links: [faker.internet.url()],
                bands: [faker.internet.userName()],
                songs: [faker.internet.userName(), faker.internet.userName(), faker.internet.userName()],
                countries: [faker.address.country()],
                cities: [faker.address.city()],
                isCompleteShow: faker.random.boolean(),
                isAudioOnly: faker.random.boolean(),
                isProRecord: faker.random.boolean(),
                soundQuality: faker.random.number({ min: 1, max: 10 }),
                videoQuality: faker.random.number({ min: 1, max: 10 }),
                state: faker.random.number({ min: 0, max: 1 }),
            })
            .expect("Content-Type", /json/)
            .expect(200)
    }
)

/** Unload fixtures */
await bootlegFixture.unload()
await userFixture.unload()