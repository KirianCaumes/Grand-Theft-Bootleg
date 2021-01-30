import { Collection } from "https://deno.land/x/mongo@v0.13.0/ts/collection.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import NotFoundException from "../types/exceptions/NotFoundException.ts";
import { UserSchema } from "./user.model.ts";

export default abstract class BaseCollection<T extends any> extends Collection<T> {
    /**
     * Clear fields
     */
    protected _setupClear(user?: UserSchema): any[] {
        return []
    }

    /**
     * About relations
     */
    protected _setupRelations(): any[] {
        return []
    }


    /**
     * Get one element by Id
     * @param id Id of the Item
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async findOneById(id: string, user?: UserSchema): Promise<T> {
        try {
            const el = (await this.aggregate([
                { $match: { _id: ObjectId(id) } },
                ...this._setupRelations(),
                ...this._setupClear(user)
            ]))?.[0]

            if (!el)
                throw new NotFoundException("Item not found")

            return el as T
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Item not found")
            throw error
        }
    }

    /**
     * Update one element by Id
     * @param id Id of the Item
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async updateOneById(id: string, update: any): Promise<T> {
        try {
            const el = await this.updateOne(
                { _id: ObjectId(id) } as any,
                update
            )

            if (!el)
                throw new NotFoundException("Item not found")

            return await this.findOneById(id)
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Item not found")
            throw error
        }
    }

    /**
     * Delete one element by Id
     * @param id Id of the Item
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async deleteOneById(id: string): Promise<T> {
        try {
            const el = await this.deleteOne(
                { _id: ObjectId(id) } as any
            )

            if (!el)
                throw new NotFoundException("Item not found")

            return await this.findOneById(id)
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Item not found")
            throw error
        }
    }
}