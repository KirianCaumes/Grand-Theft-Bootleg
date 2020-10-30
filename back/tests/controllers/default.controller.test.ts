import app from "../../app.ts"
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"

/** About / */
Deno.test(
    "Default route",
    async () => {
        // sets locale to de
        // faker.setLocale("de");
        console.log(faker.name.lastName())

        await (await superoak(app)).get('/')
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
    "Default route api",
    async () => {
        await (await superoak(app)).get('/api')
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
    "Default route random",
    async () => {
        await (await superoak(app)).get(`/aze${Math.random().toString(36).substring(7)}`)
            .expect(404)
            .expect("Content-Type", /json/)
            .expect(res => {
                if (res.body.message !== "Grand Theft Bootleg")
                    throw new Error('Error in body')
            })
    }
)