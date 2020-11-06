// import app from "../../app.ts"
// import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts"
// import bootlegFixture from "../_fixtures/bootleg.fixture.ts"
// import userFixture from "../_fixtures/user.fixture.ts"
// import { EUserRoles } from "../../types/enumerations/EUserRoles.ts"

// /** Unload fixtures */
// await bootlegFixture.unload()
// await userFixture.unload()

// /** Load fixtures */
// await userFixture.load()
// await bootlegFixture.load()

// /** [GET] /api/bootleg */
// Deno.test(
//     "[GET] Bootleg - Search",
//     async () => {
//         await (await superoak(app))
//             .get('/api/bootleg')
//             .auth(await userFixture.getToken(), { type: "bearer" })
//             .expect("Content-Type", /json/)
//             .expect(200)
//     }
// )
// Deno.test(
//     "[GET] Bootleg - Search Params",
//     async () => {
//         await (await superoak(app))
//             .get('/api/bootleg')
//             .auth(await userFixture.getToken(), { type: "bearer" })
//             .expect("Content-Type", /json/)
//             .expect(200)
//     }
// )
// //TODO Test all params
// /** [GET] /api/bootleg/:id */
// //TODO
// /** [POST] /api/bootleg */
// Deno.test(
//     "[POST] Bootleg - Not authorized",
//     async () => {
//         await (await superoak(app))
//             .post('/api/bootleg')
//             .auth(await userFixture.getToken(EUserRoles.VISITOR), { type: "bearer" })
//             .send(bootlegFixture.getItem())
//             .expect("Content-Type", /json/)
//             .expect(403)
//     }
// )
// Deno.test(
//     "[POST] Bootleg - Not authenticated",
//     async () => {
//         await (await superoak(app))
//             .post('/api/bootleg')
//             .expect("Content-Type", /json/)
//             .expect(401)
//     }
// )
// Deno.test(
//     "[POST] Bootleg - Create fail",
//     async () => {
//         await (await superoak(app))
//             .post('/api/bootleg')
//             .auth(await userFixture.getToken(), { type: "bearer" })
//             .send({
//                 toto: "tata"
//             })
//             .expect("Content-Type", /json/)
//             .expect(400)
//     }
// )
// Deno.test(
//     "[POST] Bootleg - Create success",
//     async () => {
//         await (await superoak(app))
//             .post('/api/bootleg')
//             .auth(await userFixture.getToken(), { type: "bearer" })
//             .send(bootlegFixture.getItem())
//             .expect("Content-Type", /json/)
//             .expect(200)
//     }
// )
// /** [PUT] /api/bootleg/:id */
// //TODO
// /** [DELETE] /api/bootleg/:id */
// //TODO
// /** [PUT] /api/bootleg/:id/report */
// //TODO
// /** [POST] /api/bootleg/:id/clicked */
// //TODO
// /** [POST] /api/bootleg/:id/report */
// //TODO
// /** [DELETE] /api/bootleg/:id/report */
// //TODO
