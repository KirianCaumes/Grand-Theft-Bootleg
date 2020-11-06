import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import userFixture from "../_fixtures/user.fixture.ts"
import { test, group, beforeAll, afterAll } from 'https://x.nest.land/hooked@0.1.0/mod.ts'
import bootlegFixture from "../_fixtures/bootleg.fixture.ts"
import { assert } from "https://deno.land/std@0.73.0/_util/assert.ts"

group("User", () => {
    beforeAll(async () => {
        /** Load fixtures */
        await userFixture.load()
        await bootlegFixture.load()
    })

    afterAll(async () => {
        /** Unload fixtures */
        await bootlegFixture.unload()
        await userFixture.unload()
    })

    test({ name: "Init", async fn() { assert(true) } })

    /** [POST] / */
    test({
        name: "[POST] Create > fail",
        async fn() {
            await (await superoak(app))
                .post('/api/user')
                .send({
                    toto: "tata"
                })
                .expect("Content-Type", /json/)
                .expect(400)
        }
    })
    test({
        name: "[POST] Create > success",
        async fn() {
            await (await superoak(app))
                .post('/api/user')
                .send(userFixture.getItem())
                .expect("Content-Type", /json/)
                .expect(200)
        }
    })
    /** [POST] /login */
    test({
        name: "[POST] Login > fail",
        async fn() {
            await (await superoak(app))
                .post('/api/user/login')
                .send({
                    toto: "tata"
                })
                .expect("Content-Type", /json/)
                .expect(400)
        }
    })
    test({
        name: "[POST] Login > not found",
        async fn() {
            await (await superoak(app))
                .post('/api/user/login')
                .send({
                    username: "abcdef",
                    password: "123"
                })
                .expect("Content-Type", /json/)
                .expect(404)
        }
    })
    test({
        name: "[POST] Login > success",
        async fn() {
            await (await superoak(app))
                .post('/api/user/login')
                .send({
                    username: "MyUser",
                    password: "MyUserPwd"
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .expect(res => {
                    if (!res.body?.user?.token)
                        throw new Error('Error in body')
                })
        }
    })
})