import BaseController from "./_base.controller.ts"
import { UsersCollectionType } from "../models/user.model.ts"
import { Response } from "https://deno.land/x/oak@v6.3.2/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.2/request.ts"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import { UserValidatorType } from "../validators/user.validator.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import getGoogleUser from "../helpers/stragies/getGoogleUser.ts"
import { EAuthStrategies } from "../types/enumerations/EAuthStrategies.ts"

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

        delete userBody.strategyData

        const id = (await this.collection.insertOne({
            ...userBody,
            password: !!userBody.password ? await bcrypt.hash(userBody.password) : undefined,
            role: EUserRoles.USER
        })).$oid

        response.body = this._render({
            message: 'User register succeed',
            result: {
                token: await this.collection.getToken({
                    _id: { $oid: id },
                    role: EUserRoles.USER,
                    ...userBody,
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

        //Get mail with the correct strategy
        const mail = await (async (): Promise<string> => {
            switch (userBody.strategy) {
                case EAuthStrategies.CLASSIC:
                    return userBody.mail
                case EAuthStrategies.GOOGLE:
                    return (await getGoogleUser(userBody))?.email
                case EAuthStrategies.TWITTER:
                case EAuthStrategies.FACEBOOK:
                default:
                    throw new ValidationException(
                        'Invalid authentification strategy',
                        { strategy: 'Invalid authentification strategy' }
                    )
            }
        })()

        //Check if user exist
        const user = await this.collection.findOne({ mail })

        //If no user found
        if (!user)
            throw new ValidationException(
                'User not found',
                { 'mail': 'Email not found' }
            )

        //Validate password with the correct strategy
        switch (userBody.strategy) {
            case EAuthStrategies.CLASSIC:
                if (!await bcrypt.compare(userBody.password, user.password!))
                    throw new ValidationException(
                        'Invalid password',
                        { 'password': 'Invalid password' }
                    )
            case EAuthStrategies.GOOGLE:
            case EAuthStrategies.TWITTER:
            case EAuthStrategies.FACEBOOK:
            default:
                break
        }

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