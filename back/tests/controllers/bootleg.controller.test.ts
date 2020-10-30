import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import bootlegFixture from "../_fixtures/bootleg.fixture.ts"
import userFixture from "../_fixtures/user.fixture.ts"

/** Load fixtures */
await userFixture.load()
await bootlegFixture.load()

/** About / */
Deno.test(
    "Listing",
    async () => {
        await (await superoak(app)).get('/api/bootleg')
            .expect(200)
            .expect("Content-Type", /json/)
        // .expect(res => {
        //     if (res.body.message !== "Grand Theft Bootleg")
        //         throw new Error('Error in body')
        // })
    }
)

Deno.test(
    "Listing",
    async () => {
        await (await superoak(app)).post('/api/bootleg')
            .send({
                "name": "asset X",
                "thingType": "truck-asset-type"
            })
            .set("Authorization", `Bearer ${await userFixture.getToken()}`)
            .expect('{"message":"Hello Deno!"}')
            .expect(200)

        // .expect(res => {
        //     if (res.body.message !== "Grand Theft Bootleg")
        //         throw new Error('Error in body')
        // })
    }
)

/** Unload fixtures */
// await bootlegFixture.unload()
// await userFixture.unload()