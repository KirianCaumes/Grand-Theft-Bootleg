import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"

/** About / */
Deno.test(
    "[GET] Default - Home",
    async () => {
        await (await superoak(app))
            .get('/')
            .expect(404)
            .expect("Content-Type", /json/)
            .expect(res => {
                if (res.body.message !== "Grand Theft Bootleg")
                    throw new Error('Error in body')
            })
    }
)

/** About /api */
Deno.test(
    "[GET] Default - Home Api",
    async () => {
        await (await superoak(app))
            .get('/api')
            .expect(404)
            .expect("Content-Type", /json/)
            .expect(res => {
                if (res.body.message !== "Grand Theft Bootleg")
                    throw new Error('Error in body')
            })
    }
)

/** About /{string} */
Deno.test(
    "[GET] Default - Home Random",
    async () => {
        await (await superoak(app))
            .get(`/aze${Math.random().toString(36).substring(7)}`)
            .expect(404)
            .expect("Content-Type", /json/)
            .expect(res => {
                if (res.body.message !== "Grand Theft Bootleg")
                    throw new Error('Error in body')
            })
    }
)