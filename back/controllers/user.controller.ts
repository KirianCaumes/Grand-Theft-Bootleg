import BaseController from "./_base.controller.ts"
import { UsersCollectionType } from "../models/user.model.ts"
import { Response } from "https://deno.land/x/oak@v6.3.2/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.2/request.ts"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import { UserValidatorType } from "../validators/user.validator.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import getGoogleUser from "../helpers/strategies/getGoogleUser.ts"
import { EAuthStrategies } from "../types/enumerations/EAuthStrategies.ts"
import MailService from "../services/mail.service.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import { randomBytes } from "https://deno.land/std@0.83.0/node/crypto.ts"
import { env } from "../helpers/config.ts"
import ForbiddenException from "../types/exceptions/ForbiddenException.ts"
import { UserPasswordValidatorType } from "../validators/userPassword.validator.ts"
import { UserUpdateValidatorType } from "../validators/userUpdate.validator.ts"
import { EActions } from "../types/enumerations/EActions.ts"
/**
 * User Controller
 */
export default class UserController extends BaseController {
    private collection: UsersCollectionType
    private validateUser: UserValidatorType
    private validatePassword: UserPasswordValidatorType
    private validateUpdate: UserUpdateValidatorType
    private mailService: MailService

    /** @inheritdoc */
    resultKey: string = "user"

    constructor(collection: UsersCollectionType, validateUser: UserValidatorType, validatePassword: UserPasswordValidatorType, validateUpdate: UserUpdateValidatorType, mailService: MailService) {
        super()
        this.collection = collection
        this.validateUser = validateUser
        this.validatePassword = validatePassword
        this.validateUpdate = validateUpdate
        this.mailService = mailService
    }

    /**
     * Register
     */
    async register({ request, response }: { request: Request; response: Response }) {
        //Validate data
        const userBody = await this.validateUser(await request.body().value)

        delete userBody.strategyData

        const userData = {
            ...userBody,
            password: !!userBody.password ? await bcrypt.hash(userBody.password) : undefined,
            role: EUserRoles.USER,
            createdOn: new Date(),
            modifiedOn: new Date()
        }

        const id = (await this.collection.insertOne(userData)).$oid

        response.body = this._render({
            message: 'User register succeed',
            result: {
                token: await this.collection.getToken({
                    _id: { $oid: id },
                    ...userData,
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
     * Get me
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

    /**
     * Edit me
     */
    async editMe({ request, response }: { request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Validate data
        const userBody = await this.validateUpdate(await request.body().value)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.UPDATE, user, user)

        //Update element
        const userBddUpd = await this.collection.updateOneById(
            user?._id?.$oid,
            { $set: { ...userBody, modifiedOn: new Date() } }
        )

        response.body = this._render({
            message: 'User edited',
            result: {
                ...userBddUpd
            }
        })
    }

    /**
     * Send mail
     */
    async sendMail({ params, request, response }: { params: { type: string }; request: Request; response: Response }) {
        //Get mail
        const user = await (async () => {
            const body = await request.body().value
            if (body.mail)
                return await this.collection.findOne({ mail: body.mail })
            else
                return await this._getUser(request)
        })()!

        if (!user?.mail)
            new NotFoundException('Email not found')

        //Rest token
        const token = randomBytes(20).toString('hex')

        //Send mail by type
        switch (params.type) {
            case 'password':
                if (user?.strategy !== EAuthStrategies.CLASSIC)
                    throw new ForbiddenException('You cannot do this action')

                this.collection.updateOneById(
                    user._id?.$oid,
                    { $set: { resetPassword: { token, expirationDate: new Date() } } }
                )
                await this.mailService.send(
                    user.mail,
                    'Reset your password',
                    'reset-account-pwd',
                    {
                        token,
                        url: `${env.APP_URL}/user/reset-password/${token}`,
                        userName: user.username
                    }
                )
                break
            case 'delete':
                this.collection.updateOneById(
                    user!._id?.$oid,
                    { $set: { deleteAccount: { token, expirationDate: new Date() } } }
                )
                await this.mailService.send(
                    user?.mail!,
                    'Delete your account',
                    'delete-account',
                    {
                        token,
                        url: `${env.APP_URL}/user/delete-account/${token}`,
                        userName: user?.username
                    }
                )
                break
            default:
                throw new NotFoundException()
        }

        response.body = this._render({
            message: 'Mail sended'
        })
    }

    /**
     * Reset password
     */
    async resetPwd({ params, request, response }: { params: { token: string }; request: Request; response: Response }) {
        //User body
        const userBody = await request.body().value

        //User db
        const userDb = await this.collection.findOne({ 'resetPassword.token': { $eq: params.token } } as any)

        if (!userDb)
            throw new NotFoundException("User not found")

        if (userDb?.resetPassword?.expirationDate?.getTime()! < Date.now() - (24 * 60 * 60 * 1000))
            throw new ForbiddenException('Token expired')

        if (userDb.strategy !== EAuthStrategies.CLASSIC)
            throw new ForbiddenException('You cannot do this action')

        //Validate password
        await this.validatePassword({ password: userBody.password })

        //Update password
        this.collection.updateOneById(userDb?._id?.$oid,
            {
                $set: { password: await bcrypt.hash(userBody.password) },
                $unset: { resetPassword: 1 }
            }
        )

        response.body = this._render({
            message: 'Password reseted'
        })
    }

    /**
     * Delete account
     */
    async deleteAccount({ params, request, response }: { params: { token: string }; request: Request; response: Response }) {
        //User db
        const userDb = await this.collection.findOne({ 'deleteAccount.token': { $eq: params.token } } as any)

        if (!userDb)
            throw new NotFoundException("User not found")

        if (userDb?.deleteAccount?.expirationDate?.getTime()! < Date.now() - (24 * 60 * 60 * 1000))
            throw new ForbiddenException('Token expired')

        //Delete user
        this.collection.deleteOneById(userDb?._id?.$oid)

        response.body = this._render({
            message: 'User deleted'
        })

    }
}