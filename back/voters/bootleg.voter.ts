import { BootlegSchema } from "../models/bootleg.model.ts";
import { UserSchema } from "../models/user.model.ts";
import { EActions } from "../types/enumerations/EActions.ts";
import { EBootlegStates } from "../types/enumerations/EBootlegStates.ts";
import { EUserRoles } from "../types/enumerations/EUserRoles.ts";
import Exception from "../types/exceptions/Exception.ts";

export default class BootlegVoter {
    constructor() { }

    public supports(action: EActions, subject: any) {
        // if the attribute isn't one we support, return false
        if (![EActions.CREATE].includes(action))
            return false

        // only vote on `Bootleg` objects
        if (subject.title === undefined)
            return false

        return true
    }

    public voteOnAttribute(action: EActions, subject: BootlegSchema, user: UserSchema) {
        // the user must be logged in; if not, deny access
        if (!user)
            return false

        switch (action) {
            case EActions.CREATE:
                return this.canCreate(subject, user)
            case EActions.READ:
                return this.canRead(subject, user)
            case EActions.UPDATE:
                return this.canUpdate(subject, user)
            case EActions.DELETE:
                return this.canDelete(subject, user)
            default:
                throw new Exception('This code should not be reached!')
        }
    }

    private canCreate(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.USER, EUserRoles.MODERATOR, EUserRoles.ADMIN].includes(user.role))
            return true

        return false
    }

    private canRead(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.ADMIN, EUserRoles.MODERATOR].includes(user.role))
            return true

        if (
            subject.state === EBootlegStates.DRAFT &&
            [EUserRoles.VISITOR, EUserRoles.USER].includes(user.role) &&
            subject.createdById?.$oid !== user._id.$oid
        )
            return false

        return false
    }

    private canUpdate(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.MODERATOR, EUserRoles.ADMIN].includes(user.role))
            return true

        if ([EUserRoles.USER].includes(user.role) && subject.createdById?.$oid === user._id.$oid)
            return true

        return false
    }

    private canDelete(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.MODERATOR, EUserRoles.ADMIN].includes(user.role))
            return true

        if ([EUserRoles.USER].includes(user.role) && subject.createdById?.$oid === user._id.$oid)
            return true

        return false
    }
}