import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import bootlegFixture from "../_fixtures/bootleg.fixture.ts"
import userFixture from "../_fixtures/user.fixture.ts"
import { test, group, beforeAll, afterAll } from 'https://x.nest.land/hooked@0.1.0/mod.ts'
import { assert } from "https://deno.land/std@0.73.0/_util/assert.ts"

group("Band", () => {
    beforeAll(async () => {
        /** Load fixtures */
        await userFixture.load()
        await bootlegFixture.load()
        // Deno.spl()
    })

    afterAll(async () => {
        /** Unload fixtures */
        await bootlegFixture.unload()
        await userFixture.unload()
    })

    test({ name: "Init", async fn() { assert(true) } })

    /** [POST] / */
    test({
        name: "[GET] Search > success",
        async fn() {
            await (await superoak(app))
                .get('/api/band')
                .query({
                    string: 'myb'
                })
                .auth(await userFixture.getToken(), { type: "bearer" })
                .expect("Content-Type", /json/)
                .expect(200)
                .expect(res => {
                    console.log(res.body)
                    if (!Array.isArray(res.body?.band))
                        throw new Error('Error in body')
                })
        }
    })
    test({
        name: "[GET] Search > fail",
        async fn() {
            await (await superoak(app))
                .get('/api/band')
                .query({
                    string: 'azeerttyuuio'
                })
                .auth(await userFixture.getToken(), { type: "bearer" })
                .expect("Content-Type", /json/)
                .expect(200)
                .expect(res => {
                    if (res.body?.band !== null)
                        throw new Error('Error in body')
                })
        }
    })
})