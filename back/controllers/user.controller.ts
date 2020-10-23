import BaseController from "./_base.controller.ts"
import { UsersCollectionType } from "../models/user.model.ts"
import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import Exception from "../types/exceptions/Exception.ts"
import { UserValidatorType } from "../validators/user.validator.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"

/**
 * User Controller
 */
export default class UserController extends BaseController {
    private collection: UsersCollectionType
    private validate: UserValidatorType

    /** @inheritdoc */
    resultKey: string = "user"

    constructor(collection: UsersCollectionType, validate: UserValidatorType) {
        super()
        this.collection = collection
        this.validate = validate
    }

    /**
     * Register
     */
    async register({ request, response }: { request: Request; response: Response }) {
        //Validate data
        const userBody = this.validate(await request.body().value)

        //Check if user exist
        if (await this.collection.findOne({ username: userBody.username }))
            throw new Exception('User already exist')

        const id = (await this.collection.insertOne({
            ...userBody,
            password: await bcrypt.hash(userBody.password),
            role: EUserRoles.USER
        })).$oid

        response.body = this._render({
            message: 'User register succeed',
            result: {
                token: await this.collection.getToken({
                    _id: { $oid: id },
                    role: EUserRoles.USER,
                    ...userBody
                })
            }
        })
    }

    /**
     * Login
     */
    async login({ request, response }: { request: Request; response: Response }) {
        //Validate data
        const userBody = this.validate(await request.body().value)

        //Check if user exist
        const user = await this.collection.findOne({ username: userBody.username })

        if (!user)
            throw new NotFoundException('User not found')

        if (!await bcrypt.compare(userBody.password, user.password))
            throw new Exception('Invalid password')

        response.body = this._render({
            message: 'User login succeed',
            result: {
                token: await this.collection.getToken(user)
            }
        })
    }
}