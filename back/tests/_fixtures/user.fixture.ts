import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"
import { EUserRoles } from "../../types/enumerations/EUserRoles.ts"
import BaseFixture from "./_base.fixture.ts"

class BootlegFixture extends BaseFixture {
    constructor() {
        super()
    }

    async load() {
        await this.usersCollection.insertMany(
            new Array(50).fill({}).map((x: any) => ({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                role: faker.random.arrayElement([0, 1, 2, 3]),
            }))
        )
    }

    async unload() {
        await this.usersCollection.deleteMany({})
    }

    async getToken(role = EUserRoles.USER) {
        return await this.usersCollection.getToken({
            _id: { $oid: '5fa3c4020035365c00a3c87e' }, //Arbitrary string
            username: faker.internet.userName(),
            password: faker.internet.password(),
            role
        })
    }
}

export default new BootlegFixture()