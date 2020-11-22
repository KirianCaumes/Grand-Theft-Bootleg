import Schema, { string } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'

async function AvailableUsername(input: string) {
    throw new TypeError('my error')
}

const UserSchema = {
    username: AvailableUsername,
};

const validator = Schema(UserSchema);

try {
    const user = await validator({ username: 'test' });
    console.log(user)
} catch (error) {
    console.log(error)
    console.log(error.errors[0])
    console.log(error.errors[0]?.error?.message)
    console.log(error.errors[0]?.path)
}