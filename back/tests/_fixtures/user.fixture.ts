import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/en.ts"
import { EUserRoles } from "../../types/enumerations/EUserRoles.ts"
import BaseFixture from "./_base.fixture.ts"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"

class BootlegFixture extends BaseFixture {
    constructor() {
        super()
    }

    getItem() {
        return {
            username: faker.internet.userName(),
            password: faker.internet.password(),
        }
    }

    async load() {
        await this.usersCollection.insertMany(
            [
                ...new Array(50).fill({}).map((x: any) => ({
                    ...this.getItem(),
                    role: faker.random.arrayElement([0, 1, 2, 3]),
                })),
                //Few manuals entities to test precise stuff
                {
                    username: "MyUser",
                    password: await bcrypt.hash("MyUserPwd"),
                    role: 1,
                },
                {
                    username: "MyMod",
                    password: await bcrypt.hash("MyModPwd"),
                    role: 2,
                },
                {
                    username: "MyAdmin",
                    password: await bcrypt.hash("MyAdminPwd"),
                    role: 3,
                }
            ]
        )
    }

    async unload() {
        await this.usersCollection.deleteMany({})
    }

    async getToken(role = EUserRoles.USER) {
        return await this.usersCollection.getToken({
            ...this.getItem(),
            _id: { $oid: '5fa3c4020035365c00a3c87e' }, //Arbitrary string
            role
        })
    }
}

export default new BootlegFixture()