import { BootlegSchema } from "../models/bootleg.model.ts";
import { UserSchema } from "../models/user.model.ts";
import { EActions } from "../types/enumerations/EActions.ts";
import { EBootlegStates } from "../types/enumerations/EBootlegStates.ts";
import { EUserRoles } from "../types/enumerations/EUserRoles.ts";
import Exception from "../types/exceptions/Exception.ts";
import BaseVoter from "./_base.voter.ts";

export default class BootlegVoter extends BaseVoter {
    constructor() {
        super()
    }

    public supports(action: EActions, subject: any) {
        // if the attribute isn't one we support, return false
        if (![EActions.CREATE, EActions.READ, EActions.UPDATE, EActions.DELETE, EActions.CLICKED, EActions.CREATE_REPORT, EActions.DELETE_REPORT].includes(action))
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
            case EActions.CLICKED:
                return this.canClick(subject, user)
            case EActions.CREATE_REPORT:
                return this.canCreateReport(subject, user)
            case EActions.DELETE_REPORT:
                return this.canDeleteReport(subject, user)
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

        if ([EBootlegStates.PUBLISHED].includes(subject.state))
            return true

        if (
            [EBootlegStates.DRAFT, EBootlegStates.PENDING].includes(subject.state) &&
            [EUserRoles.VISITOR, EUserRoles.USER].includes(user.role) &&
            subject.createdById?.$oid === user._id.$oid
        )
            return true

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

    private canClick(subject: BootlegSchema, user: UserSchema) {
        if (!!subject.clicked?.find(x =>
            x.userId?.$oid === user._id.$oid &&
            x.date > new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
        ))
            return false

        if ([EUserRoles.ADMIN, EUserRoles.MODERATOR].includes(user.role))
            return true

        if (
            [EUserRoles.VISITOR, EUserRoles.USER].includes(user.role) &&
            [EBootlegStates.PUBLISHED].includes(subject.state)
        )
            return true

        return false
    }

    private canCreateReport(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.ADMIN, EUserRoles.MODERATOR].includes(user.role))
            return true

        if (
            [EUserRoles.VISITOR, EUserRoles.USER].includes(user.role) &&
            [EBootlegStates.PUBLISHED].includes(subject.state)
        )
            return true

        return false
    }

    private canDeleteReport(subject: BootlegSchema, user: UserSchema) {
        if ([EUserRoles.ADMIN, EUserRoles.MODERATOR].includes(user.role))
            return true

        return false
    }
}