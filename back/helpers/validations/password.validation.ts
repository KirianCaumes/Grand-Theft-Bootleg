import { PasswordPolicy } from "https://x.nest.land/pwchecker@v0.1.1/mod.ts"

/** Check if valid passord */
export default function passwordValidation(input: string): string {
    const pwpolicy = new PasswordPolicy()

    const res = pwpolicy.password_policy_compliance(input)

    if (Object.keys(res).filter(x => !(res as any)[x]).length) {
        const errors = [
            !res.hasMinLen ? `${pwpolicy.minLen} character${pwpolicy.minLen > 1 ? 's' : ''}` : undefined,
            !res.hasMinUppercase ? `${pwpolicy.minUppercase} uppercase character${pwpolicy.minUppercase > 1 ? 's' : ''}` : undefined,
            !res.hasMinLowercase ? `${pwpolicy.minLowercase} lowercase character${pwpolicy.minLowercase > 1 ? 's' : ''}` : undefined,
            !res.hasMinSpecialChars ? `${pwpolicy.minSpecialChars} special character${pwpolicy.minSpecialChars > 1 ? 's' : ''}` : undefined,
            !res.hasMinDigits ? `${pwpolicy.minDigits} digit${pwpolicy.minDigits > 1 ? 's' : ''}` : undefined,
        ].filter(x => x)
        throw new TypeError(
            `Your password is not secure: ${errors.length > 1 ? `${errors.slice(0, -1).join(', ')} and ${errors.slice(-1)}` : errors?.[0]} minimum ${errors.length > 1 ? 'are' : 'is'} required.`
        )
    }

    return input
}