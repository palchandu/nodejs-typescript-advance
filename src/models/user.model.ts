import mongoose from "mongoose";
import bcrypt from "bcrypt";
import confing from 'config';
import uniqueValidator from 'mongoose-unique-validator'
import log from "../utils/logger";
export interface UserInput {
    email: string;
    name: string;
    password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    let user = this as unknown as UserDocument
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(confing.get('saltWorkFactor'));
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
    return next();

})
userSchema.plugin(uniqueValidator);
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
    const user = await this as unknown as UserDocument
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}
const userModel = mongoose.model<UserDocument>('User', userSchema);
export default userModel;