import { UserSchema } from "../models/user.model.ts"
import { EActions } from "../types/enumerations/EActions.ts"
import Exception from "../types/exceptions/Exception.ts"
import BaseVoter from "./_base.voter.ts"

export default class UserVoter extends BaseVoter {
    constructor() {
        super()
    }

    public supports(action: EActions, subject: any) {
        // if the attribute isn't one we support, return false
        if (![EActions.UPDATE].includes(action))
            return false

        // only vote on `User` objects
        if (subject.username === undefined)
            return false

        return true
    }

    public voteOnAttribute(action: EActions, subject: UserSchema, user: UserSchema) {
        // the user must be logged in; if not, deny access
        if (!user)
            return false

        switch (action) {
            case EActions.UPDATE:
                return this.canUpdate(subject, user)
            default:
                throw new Exception('This code should not be reached!')
        }
    }

    private canUpdate(subject: UserSchema, user: UserSchema) {
        if (subject._id?.$oid === user._id.$oid)
            return true

        return false
    }
}