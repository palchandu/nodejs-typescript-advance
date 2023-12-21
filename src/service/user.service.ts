import { any } from 'zod';
import userModel, { UserDocument, UserInput } from '../models/user.model'
import { omit } from 'lodash'
import { FilterQuery } from 'mongoose';

export async function createUser(input: UserInput) {
    try {
        const user = await userModel.create(input)
        return omit(user, "password");
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function validatePassword({ email, password }: { email: string, password: string }) {
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return false
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        return false;
    }
    return omit(user.toJSON(), "password");
}

export async function finduser(query: FilterQuery<UserDocument>) {
    return userModel.findOne(query).lean();
}