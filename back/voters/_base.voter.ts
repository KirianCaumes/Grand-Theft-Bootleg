import { UserSchema } from "../models/user.model.ts";
import { EActions } from "../types/enumerations/EActions.ts";

export default abstract class BaseVoter {
    constructor() { }

    public supports(action: EActions, subject: any): boolean {
        return false
    }

    public voteOnAttribute(action: EActions, subject: any, user: UserSchema): boolean {
        return false
    }
}