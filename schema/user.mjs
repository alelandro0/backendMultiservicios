import { hash } from "bcrypt";
import Mongoose from "mongoose";
import bcrypt from"bcrypt";
import { generateAccessToken, generateRefreshToken } from "../auth/generateTokens.mjs";
import getUserInfo  from "../lib/getUserInfo.mjs";
import Token  from "./token.mjs";
const UserSchema = new Mongoose.Schema({
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
});

UserSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
        const document = this;

        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        })
    } else {
        next();
    }
})

UserSchema.methods.usernameExist = async function (username) {
    const result = await Mongoose.model("User").find({ username });
    return result.length > 0;
};

UserSchema.methods.comparePassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
};

UserSchema.methods.createAccessToken = function () {
    return generateAccessToken(getUserInfo(this));
}

UserSchema.methods.createRefreshToken = async function () {
    const refreshToken = generateRefreshToken(getUserInfo(this))
    try {
        await new Token({ token: refreshToken }).save();

        return refreshToken;
    } catch (error) {
        console.log(error)
    }
}

export default Mongoose.model("User", UserSchema);