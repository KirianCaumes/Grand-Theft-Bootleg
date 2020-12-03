import BaseController from "./_base.controller.ts"
import { UsersCollectionType } from "../models/user.model.ts"
import { Response } from "https://deno.land/x/oak@v6.3.2/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.2/request.ts"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import Exception from "../types/exceptions/Exception.ts"
import { UserValidatorType } from "../validators/user.validator.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"

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
        const userBody = await this.validate(await request.body().value)

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
        //User body
        const userBody = await request.body().value

        //Check if user exist
        const user = await this.collection.findOne({ mail: userBody.mail })

        if (!user)
            throw new ValidationException(
                'User not found',
                { 'mail': 'Email not found' }
            )

        if (!await bcrypt.compare(userBody.password, user.password))
            throw new ValidationException(
                'Invalid password',
                { 'password': 'Invalid password' }
            )

        response.body = this._render({
            message: 'User login succeed',
            result: {
                token: await this.collection.getToken(user)
            }
        })
    }

    /**
     * getMe
     */
    async getMe({ request, response }: { request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        response.body = this._render({
            message: 'User got',
            result: {
                ...user
            }
        })
    }
}